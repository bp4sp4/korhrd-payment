"use client";

import { PaymentButton } from "@/components/PaymentButton";
import { formatCurrency } from "@/lib/utils";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {/* 헤더 */}
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold text-black mb-4">
              회사 결제 시스템
            </h1>
            <p className="text-xl text-black">
              안전하고 편리한 토스페이먼츠 결제 서비스
            </p>
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
                      {formatCurrency(50000)}
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

                  <PaymentButton
                    amount={50000}
                    orderName="프리미엄 서비스 1개월"
                    customerName="홍길동"
                    customerEmail="hong@example.com"
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
              <li>• 결제 완료 후 이메일로 영수증이 발송됩니다.</li>
              <li>• 문의사항이 있으시면 고객센터로 연락해주세요.</li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
}
