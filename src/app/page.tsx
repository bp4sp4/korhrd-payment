"use client";

import { useState } from "react";
import { PaymentButton } from "@/components/PaymentButton";
import { formatCurrency } from "@/lib/utils";
import { CreditCard, Building2 } from "lucide-react";

export default function Home() {
  const [selectedMethod, setSelectedMethod] = useState<string>("CARD");

  const handleMethodChange = (method: string) => {
    setSelectedMethod(method);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {/* 헤더 */}
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold text-black mb-4">
              한평생결제전용사이트
            </h1>
            <p className="text-xl text-black">안전하고 간편하게 결제하세요</p>
          </div>

          {/* 결제 카드 */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <div className="grid md:grid-cols-2 gap-8">
              {/* 결제 정보 */}
              <div>
                <h2 className="text-2xl font-semibold text-black mb-6">
                  결제 정보
                </h2>

                <div className="space-y-4">
                  <div className="flex justify-between items-center py-3 border-b border-gray-200">
                    <span className="text-black">상품명</span>
                    <span className="font-medium text-black">
                      프리미엄 서비스
                    </span>
                  </div>

                  <div className="flex justify-between items-center py-3 border-b border-gray-200">
                    <span className="text-black">결제 금액</span>
                    <span className="text-2xl font-bold text-black">
                      {formatCurrency(40000)}
                    </span>
                  </div>

                  <div className="flex justify-between items-center py-3 border-b border-gray-200">
                    <span className="text-black">서비스 기간</span>
                    <span className="font-medium text-black">1개월</span>
                  </div>

                  <div className="flex justify-between items-center py-3">
                    <span className="text-black">결제 수단</span>
                    <span className="font-medium text-black">토스페이먼츠</span>
                  </div>
                </div>
              </div>

              {/* 결제 폼 */}
              <div>
                <h2 className="text-2xl font-semibold text-black mb-6">
                  결제 진행
                </h2>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-black mb-2">
                      고객명
                    </label>
                    <input
                      type="text"
                      id="customerName"
                      defaultValue="홍길동"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-black mb-2">
                      이메일
                    </label>
                    <input
                      type="email"
                      id="customerEmail"
                      defaultValue="hong@example.com"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-black mb-2">
                      회사명
                    </label>
                    <input
                      type="text"
                      id="companyName"
                      defaultValue="한평생교육그룹"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                    />
                  </div>

                  {/* 결제 수단 선택 */}
                  <div>
                    <label className="block text-sm font-medium text-black mb-3">
                      결제 수단 선택
                    </label>
                    <div className="space-y-3">
                      <label className="flex items-center space-x-3 cursor-pointer p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="CARD"
                          checked={selectedMethod === "CARD"}
                          onChange={() => handleMethodChange("CARD")}
                          className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                        />
                        <CreditCard className="w-5 h-5 text-blue-600" />
                        <span className="text-black font-medium">신용카드</span>
                      </label>

                      <label className="flex items-center space-x-3 cursor-pointer p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="VIRTUAL_ACCOUNT"
                          checked={selectedMethod === "VIRTUAL_ACCOUNT"}
                          onChange={() => handleMethodChange("VIRTUAL_ACCOUNT")}
                          className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                        />
                        <Building2 className="w-5 h-5 text-green-600" />
                        <span className="text-black font-medium">
                          무통장입금
                        </span>
                      </label>
                    </div>
                  </div>

                  <PaymentButton
                    amount={40000}
                    orderName="프리미엄 서비스 1개월"
                    customerName="홍길동"
                    customerEmail="hong@example.com"
                    selectedMethods={[selectedMethod]}
                    className="w-full"
                    onSuccess={(paymentKey) => {
                      console.log("결제 성공:", paymentKey);
                      alert("결제가 성공적으로 완료되었습니다!");
                    }}
                    onError={(error) => {
                      console.error("결제 오류:", error);
                      alert(`결제 중 오류가 발생했습니다: ${error}`);
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 안내사항 */}
          <div className="bg-blue-50 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-black mb-4">
              결제 안내사항
            </h3>
            <ul className="space-y-2 text-sm text-black">
              <li>• 결제는 토스페이먼츠를 통해 안전하게 처리됩니다.</li>
              <li>
                • 카드, 계좌이체, 가상계좌 등 다양한 결제 수단을 지원합니다.
              </li>
              <li>• 무통장입금의 경우 입금 확인 후 서비스가 시작됩니다.</li>
              <li>• 결제 완료 후 이메일로 영수증이 발송됩니다.</li>
              <li>• 문의사항이 있으시면 고객센터로 연락해주세요.</li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
}
