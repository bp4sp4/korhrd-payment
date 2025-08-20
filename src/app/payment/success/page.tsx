"use client";

import { useEffect, useState, useCallback } from "react";
import {
  CheckCircle,
  Home,
  Receipt,
  Building2,
  Copy,
  Clock,
} from "lucide-react";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils";

interface PaymentInfo {
  orderId: string;
  amount: number;
  method: string;
  approvedAt: string;
  paymentKey: string;
  status: string;
}

interface VirtualAccountInfo {
  accountNumber: string;
  bankCode: string;
  bankName: string;
  dueDate: string;
  amount: number;
  orderId: string;
  customerName: string;
  secret?: string;
}

export default function PaymentSuccessPage() {
  const [paymentInfo, setPaymentInfo] = useState<PaymentInfo | null>(null);
  const [virtualAccountInfo, setVirtualAccountInfo] =
    useState<VirtualAccountInfo | null>(null);
  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [statusCheckInterval, setStatusCheckInterval] =
    useState<NodeJS.Timeout | null>(null);

  const fetchVirtualAccountInfo = useCallback(
    async (paymentKey: string, orderId: string, amount: number) => {
      try {
        // 토스페이먼츠 결제 정보 조회 API 호출
        const response = await fetch("/api/payments/confirm", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            paymentKey,
            orderId,
            amount,
          }),
        });

        if (response.ok) {
          const data = await response.json();

          console.log("무통장입금 정보 조회 응답:", {
            status: data.status,
            method: data.method,
            virtualAccount: data.virtualAccount ? "있음" : "없음",
            success: data.success,
            message: data.message,
          });

          // API에서 404를 200으로 응답한 경우 (무통장입금 대기 상태)
          if (data.success === false && data.paymentStatus === "PENDING") {
            console.log("무통장입금 대기 상태 - 사용자가 아직 입금하지 않음");

            // 임시 가상계좌 정보 생성 (실제로는 토스페이먼츠에서 제공해야 함)
            const tempVirtualAccount: VirtualAccountInfo = {
              accountNumber: "123-456789-01-234",
              bankCode: "088",
              bankName: "신한은행",
              dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
                .toISOString()
                .split("T")[0],
              amount: amount,
              orderId: orderId,
              customerName: "홍길동",
            };
            setVirtualAccountInfo(tempVirtualAccount);

            // 대기 상태로 설정
            setPaymentInfo((prev) => ({
              ...prev!,
              status: "WAITING_FOR_DEPOSIT",
            }));

            console.log("무통장입금 대기 상태 설정 완료");
            return;
          }

          // 가상계좌 정보 추출
          if (data.virtualAccount) {
            const virtualAccount: VirtualAccountInfo = {
              accountNumber: data.virtualAccount.accountNumber,
              bankCode: data.virtualAccount.bankCode,
              bankName: getBankName(data.virtualAccount.bankCode),
              dueDate: data.virtualAccount.dueDate,
              amount: data.amount,
              orderId: data.orderId,
              customerName: "홍길동", // 실제로는 동적으로 가져와야 함
              secret: data.secret, // 웹훅 검증용
            };
            setVirtualAccountInfo(virtualAccount);

            // 무통장입금은 항상 WAITING_FOR_DEPOSIT 상태로 시작
            // 실제 입금이 완료될 때까지 이 상태를 유지
            // 토스페이먼츠에서 DONE으로 와도 강제로 WAITING_FOR_DEPOSIT로 설정
            setPaymentInfo((prev) => ({
              ...prev!,
              status: "WAITING_FOR_DEPOSIT", // 강제로 대기 상태로 설정
            }));

            console.log(
              "무통장입금 대기 상태로 설정됨 - 실제 입금 완료까지 대기"
            );

            // 무통장입금 상태 주기적 확인 시작 (30초마다)
            const interval = setInterval(() => {
              checkPaymentStatus(paymentKey);
            }, 30000); // 30초마다 확인

            setStatusCheckInterval(interval);
          }
        } else {
          const errorData = await response.json();
          console.error("무통장입금 정보 조회 실패:", errorData);
        }
      } catch (error) {
        console.error("무통장입금 정보 조회 오류:", error);
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const paymentKey = urlParams.get("paymentKey");
    const orderId = urlParams.get("orderId");
    const amount = urlParams.get("amount");
    const method = urlParams.get("method");
    const status = urlParams.get("status");

    if (paymentKey && orderId && amount) {
      const info: PaymentInfo = {
        orderId,
        amount: parseInt(amount),
        method: method || "토스페이먼츠",
        approvedAt: new Date().toLocaleString("ko-KR"),
        paymentKey,
        status: status || "WAITING_FOR_DEPOSIT",
      };
      setPaymentInfo(info);

      // 무통장입금인 경우 결제 정보 조회
      if (method === "VIRTUAL_ACCOUNT" || method === "가상계좌") {
        // 무통장입금은 처음부터 WAITING_FOR_DEPOSIT 상태로 설정
        setPaymentInfo({ ...info, status: "WAITING_FOR_DEPOSIT" });
        fetchVirtualAccountInfo(paymentKey, orderId, parseInt(amount));
      } else {
        // 카드 결제는 즉시 완료
        setPaymentInfo({ ...info, status: "DONE" });
        setIsLoading(false);
      }
    } else {
      setIsLoading(false);
    }

    return () => {
      if (statusCheckInterval) {
        clearInterval(statusCheckInterval);
      }
    };
  }, [fetchVirtualAccountInfo, statusCheckInterval]);

  const checkPaymentStatus = useCallback(
    async (paymentKey: string) => {
      try {
        const response = await fetch(`/api/payments/status/${paymentKey}`);

        if (response.ok) {
          const data = await response.json();

          console.log("결제 상태 확인:", {
            status: data.status,
            method: data.method,
            orderId: data.orderId,
          });

          // 무통장입금이 완료된 경우에만 상태 변경
          if (
            data.method === "VIRTUAL_ACCOUNT" &&
            data.status === "DONE" &&
            paymentInfo
          ) {
            console.log("무통장입금 완료! 상태를 DONE으로 변경");
            setPaymentInfo({
              ...paymentInfo,
              status: "DONE",
            });

            // 상태 확인 인터벌 중지
            if (statusCheckInterval) {
              clearInterval(statusCheckInterval);
              setStatusCheckInterval(null);
            }
          } else if (
            data.method === "VIRTUAL_ACCOUNT" &&
            data.status === "WAITING_FOR_DEPOSIT"
          ) {
            console.log("무통장입금 대기 중 - 계속 대기");
          } else {
            console.log("다른 결제 수단 또는 상태:", data.method, data.status);
          }
        }
      } catch (error) {
        console.error("결제 상태 확인 오류:", error);
      }
    },
    [paymentInfo, statusCheckInterval]
  );

  const getBankName = (bankCode: string): string => {
    const bankNames: { [key: string]: string } = {
      "088": "신한은행",
      "004": "KB국민은행",
      "020": "우리은행",
      "081": "하나은행",
      "003": "IBK기업은행",
      "011": "NH농협은행",
      "023": "SC제일은행",
      "027": "한국씨티은행",
      "031": "대구은행",
      "032": "부산은행",
      "034": "광주은행",
      "035": "제주은행",
      "037": "전북은행",
      "039": "경남은행",
      "045": "새마을금고",
      "048": "신협",
      "050": "상호저축은행",
      "052": "모간스탠리은행",
      "054": "HSBC은행",
      "055": "도이치은행",
      "057": "제이피모간체이스은행",
      "058": "미즈호은행",
      "059": "미쓰비시도쿄UFJ은행",
      "060": "BOA은행",
      "061": "비엔피파리바은행",
      "062": "중국공상은행",
      "063": "중국은행",
      "064": "산림조합중앙회",
      "065": "대화은행",
      "066": "교통은행",
      "067": "중국건설은행",
      "071": "우체국예금보험",
      "090": "카카오뱅크",
      "092": "토스뱅크",
      "209": "유안타증권",
      "218": "KB증권",
      "230": "미래에셋증권",
      "238": "대우증권",
      "240": "삼성증권",
      "243": "한국투자증권",
      "247": "우리투자증권",
      "261": "교보증권",
      "262": "하이투자증권",
      "263": "HMC투자증권",
      "264": "키움증권",
      "265": "이베스트투자증권",
      "266": "SK증권",
      "267": "대신증권",
      "268": "아이엠투자증권",
      "269": "한화투자증권",
      "270": "하나대투증권",
      "271": "신한투자증권",
      "278": "신영증권",
      "279": "동부증권",
      "280": "유진투자증권",
      "287": "메리츠증권",
      "288": "카카오페이증권",
      "290": "부국증권",
      "291": "신한금융투자",
      "292": "LIG투자증권",
      "293": "리딩투자증권",
      "294": "한국증권금융",
      "295": "한국포스증권",
    };
    return bankNames[bankCode] || bankCode;
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("클립보드 복사 실패:", error);
    }
  };

  const isVirtualAccount =
    paymentInfo?.method === "VIRTUAL_ACCOUNT" ||
    paymentInfo?.method === "가상계좌";
  const isWaitingForDeposit = paymentInfo?.status === "WAITING_FOR_DEPOSIT";

  if (isLoading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-black">결제 정보를 확인하는 중...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="text-center mb-8">
              {isVirtualAccount && isWaitingForDeposit ? (
                <Clock className="w-16 h-16 text-orange-500 mx-auto mb-4" />
              ) : (
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              )}
              <h1 className="text-3xl font-bold text-black mb-2">
                {isVirtualAccount && isWaitingForDeposit
                  ? "무통장입금 대기 중"
                  : "결제가 완료되었습니다!"}
              </h1>
              <p className="text-black">
                {isVirtualAccount && isWaitingForDeposit
                  ? "아래 계좌로 입금해주시면 결제가 완료됩니다."
                  : "안전하게 결제가 처리되었습니다."}
              </p>
              {isVirtualAccount && isWaitingForDeposit && (
                <p className="text-sm text-orange-600 mt-2">
                  💡 입금 확인 중... (30초마다 자동 확인)
                </p>
              )}
            </div>

            {paymentInfo && (
              <div className="bg-gray-50 rounded-lg p-6 mb-8">
                <div className="flex items-center gap-2 mb-4">
                  <Receipt className="w-5 h-5 text-gray-600" />
                  <h2 className="text-lg font-semibold text-black">
                    결제 정보
                  </h2>
                </div>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-black">주문번호</span>
                    <span className="text-black font-mono">
                      {paymentInfo.orderId}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-black">결제 금액</span>
                    <span className="text-black font-bold">
                      {formatCurrency(paymentInfo.amount)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-black">결제 수단</span>
                    <span className="text-black">{paymentInfo.method}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-black">결제 시간</span>
                    <span className="text-black">{paymentInfo.approvedAt}</span>
                  </div>
                </div>
              </div>
            )}

            {virtualAccountInfo && (
              <div className="bg-blue-50 rounded-lg p-6 mb-8">
                <div className="flex items-center gap-2 mb-4">
                  <Building2 className="w-5 h-5 text-blue-600" />
                  <h2 className="text-lg font-semibold text-black">
                    무통장입금 안내
                  </h2>
                </div>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-black">은행</span>
                    <span className="text-black">
                      {virtualAccountInfo.bankName}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-black">계좌번호</span>
                    <div className="flex items-center gap-2">
                      <span className="text-black font-mono">
                        {virtualAccountInfo.accountNumber}
                      </span>
                      <button
                        onClick={() =>
                          copyToClipboard(virtualAccountInfo.accountNumber)
                        }
                        className="p-1 hover:bg-blue-200 rounded transition-colors"
                        title="계좌번호 복사"
                      >
                        {copied ? (
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        ) : (
                          <Copy className="w-4 h-4 text-blue-600" />
                        )}
                      </button>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-black">입금자명</span>
                    <span className="text-black">
                      {virtualAccountInfo.customerName}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-black">입금기한</span>
                    <span className="text-red-600 font-medium">
                      {virtualAccountInfo.dueDate}
                    </span>
                  </div>
                </div>
                <div className="mt-4 p-3 bg-blue-100 rounded-lg">
                  <p className="text-sm text-blue-800">
                    💡 토스페이먼츠에서 제공하는 실제 가상계좌입니다.
                  </p>
                </div>
              </div>
            )}

            <div className="space-y-3">
              {isVirtualAccount && isWaitingForDeposit ? (
                <>
                  <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                    <p className="text-sm text-orange-800 text-center">
                      🏦 위 계좌로 입금하신 후, 토스페이먼츠 개발자센터에서
                      &quot;입금처리&quot; 버튼을 눌러주세요.
                    </p>
                  </div>
                  <Link
                    href="/"
                    className="w-full flex items-center justify-center gap-2 bg-gray-100 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    <Home className="w-5 h-5" />
                    홈으로 돌아가기
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    href="/"
                    className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Home className="w-5 h-5" />
                    홈으로 돌아가기
                  </Link>
                  <button
                    onClick={() => window.print()}
                    className="w-full flex items-center justify-center gap-2 bg-gray-100 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    <Receipt className="w-5 h-5" />
                    영수증 출력
                  </button>
                </>
              )}
            </div>

            <div className="mt-6 text-xs text-black">
              <p>결제 관련 문의사항이 있으시면</p>
              <p>고객센터로 연락해주세요.</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
