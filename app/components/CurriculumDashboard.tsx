'use client'

import React, { useState } from 'react'
import type { DynamicCurriculum, CurriculumBlock } from '@/lib/curriculum'

interface Props {
  data: DynamicCurriculum
}

export default function CurriculumDashboard({ data }: Props) {
  const [activeTab, setActiveTab] = useState<string>(data.blocks[0]?.id || '')
  const activeBlock = data.blocks.find((b) => b.id === activeTab)

  return (
    <div className="max-w-6xl mx-auto my-8 bg-white shadow-xl rounded-xl overflow-hidden border border-slate-100 font-sans text-slate-800">
      
      {/* HEADER BANNER - Kiểu dáng thanh lịch sâu lắng giống PDF */}
      <div className="bg-[#1a365d] text-white px-8 py-10 border-b-4 border-[#d69e2e]">
        <h1 className="text-3xl font-extrabold tracking-wide uppercase text-white mb-2">
          {data.title}
        </h1>
        <p className="text-lg text-slate-300 italic font-light">
          {data.subtitle}
        </p>
      </div>

      <div className="p-8">
        <h2 className="text-xl font-bold text-[#1a365d] uppercase border-l-4 border-[#d69e2e] pl-3 mb-6">
          I. Khung Lộ Trình Đào Tạo Theo Từng Khối Lớp
        </h2>

        {/* TAB CONTROLLER - Thanh chuyển đổi mượt mà */}
        <div className="flex flex-wrap gap-2 mb-8 bg-slate-50 p-2 rounded-lg border border-slate-200">
          {data.blocks.map((block) => (
            <button
              key={block.id}
              onClick={() => setActiveTab(block.id)}
              className={`flex-1 min-w-[140px] px-5 py-3 text-sm font-semibold rounded-md transition-all duration-200 uppercase text-center ${
                activeTab === block.id
                  ? 'bg-[#1a365d] text-white shadow-md'
                  : 'text-slate-600 hover:bg-slate-200 hover:text-slate-900'
              }`}
            >
              {block.gradeName}
            </button>
          ))}
        </div>

        {/* ACTIVE TAB CONTENT DISPLAY */}
        {activeBlock && (
          <div className="animate-fadeIn bg-white rounded-lg p-2 transition-all">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-100 pb-4 mb-6 gap-2 flex-wrap">
              <div>
                <h3 className="text-2xl font-bold text-[#2b6cb0]">
                  {activeBlock.gradeName}: <span className="text-slate-600 font-medium text-xl">{activeBlock.tagline}</span>
                </h3>
              </div>
              <span className="inline-block bg-amber-50 text-amber-800 border border-amber-200 text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider">
                ⏱ {activeBlock.duration}
              </span>
            </div>

            {/* Mục tiêu cốt lõi */}
            <div className="mb-6">
              <h4 className="text-sm font-bold uppercase text-slate-400 tracking-wider mb-2">Mục tiêu cốt lõi</h4>
              <p className="text-base text-slate-700 leading-relaxed text-justify bg-slate-50 p-4 rounded-lg border-l-2 border-slate-400 whitespace-pre-line">
                {activeBlock.coreGoal}
              </p>
            </div>

            {/* TRƯỜNG HỢP: Lớp 1, 2 có mảng chiến lược (strategies) */}
            {activeBlock.strategies && (
              <div className="mb-6">
                <h4 className="text-sm font-bold uppercase text-slate-400 tracking-wider mb-3">Giải pháp giảng dạy của trung tâm</h4>
                <ul className="space-y-3">
                  {activeBlock.strategies.map((st, index) => (
                    <li key={index} className="flex items-start gap-3 text-slate-700">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#2b6cb0] text-white text-xs flex items-center justify-center font-bold mt-0.5">
                        {index + 1}
                      </span>
                      <span className="leading-relaxed text-justify">{st}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* TRƯỜNG HỢP: Lớp 3, 4 phân tách nhánh hệ thống (systems) */}
            {activeBlock.systems && (
              <div className="mb-6">
                <h4 className="text-sm font-bold uppercase text-slate-400 tracking-wider mb-3">Hệ thống phân tách đào tạo</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {activeBlock.systems.map((sys, idx) => (
                    <div key={idx} className="border border-slate-200 p-5 rounded-lg bg-slate-50 hover:shadow-md transition-shadow">
                      <h5 className="font-bold text-[#1a365d] text-base mb-2 border-b border-slate-200 pb-2 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-[#d69e2e]"></span>
                        {sys.name}
                      </h5>
                      <p className="text-sm text-slate-600 leading-relaxed text-justify">
                        {sys.content}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TRƯỜNG HỢP: Ma trận phân nhóm đối tượng lớp 5 (matrixTable) */}
            {activeBlock.matrixTable && (
              <div className="mb-6">
                <h4 className="text-sm font-bold uppercase text-slate-400 tracking-wider mb-3">Ma trận phân nhóm đối tượng học sinh chiến lược</h4>
                <div className="overflow-x-auto rounded-lg border border-slate-200 shadow-sm">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-[#2b6cb0] text-white text-sm">
                        <th className="p-4 font-bold w-1/4 border-r border-[#2b6cb0]">Phân Nhóm Đối Tượng</th>
                        <th className="p-4 font-bold w-5/12 border-r border-[#2b6cb0]">Chiến Lược Hành Động Tại Trung Tâm</th>
                        <th className="p-4 font-bold w-1/3">Mục Tiêu & Giải Pháp Tâm Lý</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 text-sm text-slate-700">
                      {activeBlock.matrixTable.map((row, rIdx) => (
                        <tr key={rIdx} className="hover:bg-slate-50/80 transition-colors odd:bg-white even:bg-slate-50/50">
                          <td className="p-4 font-bold text-[#1a365d] align-top border-r border-slate-200">
                            {row.group}
                          </td>
                          <td className="p-4 align-top leading-relaxed text-justify border-r border-slate-200">
                            {row.action}
                          </td>
                          <td className="p-4 align-top leading-relaxed text-justify italic text-slate-600">
                            {row.psycho}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* PHẦN QUY TẮC VẬN HÀNH VÀNG */}
        <div className="mt-12 pt-8 border-t border-slate-200">
          <h2 className="text-xl font-bold text-[#1a365d] uppercase border-l-4 border-[#d69e2e] pl-3 mb-6">
            II. 4 Quy Tắc Vận Hành Vàng Để Xây Dựng Uy Tín Trung Tâm
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data.rules.map((rule, idx) => (
              <div key={idx} className="border-l-4 border-rose-600 bg-rose-50/30 p-5 rounded-r-lg border border-y-slate-200 border-r-slate-200">
                <h4 className="font-bold text-rose-900 text-sm md:text-base mb-2 flex items-center gap-1.5">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-rose-600"></span>
                  {rule.title}
                </h4>
                <p className="text-xs md:text-sm text-slate-600 leading-relaxed text-justify">
                  {rule.content}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}