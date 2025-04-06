'use client';

import { Announcement } from '../types/announcement';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import { useEffect, useState } from 'react';
import PdfModal from './PdfModal';

// PDF.js 워커 설정
pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js';

interface AnnouncementListProps {
  announcements: Announcement[];
}

interface PdfState {
  [key: string]: {
    currentPage: number;
    numPages: number;
  };
}

export default function AnnouncementList({ announcements }: AnnouncementListProps) {
  const [pdfStates, setPdfStates] = useState<PdfState>({});
  const [selectedPdf, setSelectedPdf] = useState<string | null>(null);

  const handlePageChange = (announcementId: string, direction: 'prev' | 'next') => {
    setPdfStates(prev => {
      const currentState = prev[announcementId];
      if (!currentState) return prev;

      const newPage = direction === 'prev' 
        ? Math.max(1, currentState.currentPage - 1)
        : Math.min(currentState.numPages, currentState.currentPage + 1);

      return {
        ...prev,
        [announcementId]: {
          ...currentState,
          currentPage: newPage
        }
      };
    });
  };

  return (
    <div className="space-y-8">
      {announcements.map((announcement) => (
        <div
          key={announcement.id}
          className="group relative p-8 rounded-3xl bg-gradient-to-br from-white via-gray-50 to-gray-100 dark:from-gray-800 dark:via-gray-700 dark:to-gray-600 border border-gray-100 dark:border-gray-600 shadow-lg hover:shadow-2xl transition-all duration-200 ease-out hover:scale-[1.02] hover:border-blue-200/50 dark:hover:border-blue-400/50 flex gap-8 backdrop-blur-sm overflow-hidden"
        >
          {/* 그라데이션 오버레이 */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-purple-50/20 to-pink-50/10 dark:from-blue-900/20 dark:via-purple-900/20 dark:to-pink-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-150 ease-out" />
          
          {/* 애니메이션 효과를 위한 요소 */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 dark:via-gray-700/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-300 ease-out" />
          
          <div 
            className="w-64 h-80 rounded-2xl overflow-hidden flex items-center justify-center bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-500 relative group/pdf shadow-md cursor-pointer"
            onClick={() => setSelectedPdf(announcement.pdfUrl)}
          >
            <Document
              file={announcement.pdfUrl}
              loading={<div className="w-full h-full bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 flex items-center justify-center">로딩중...</div>}
              error={<div className="w-full h-full bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 flex items-center justify-center">PDF를 불러올 수 없습니다</div>}
              onLoadSuccess={({ numPages }) => {
                setPdfStates(prev => ({
                  ...prev,
                  [announcement.id]: {
                    currentPage: 1,
                    numPages
                  }
                }));
              }}
            >
              <Page
                pageNumber={pdfStates[announcement.id]?.currentPage || 1}
                width={224}
                renderTextLayer={false}
                renderAnnotationLayer={false}
              />
            </Document>
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex flex-col gap-2 opacity-0 group-hover/pdf:opacity-100 transition-all duration-300">
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  handlePageChange(announcement.id, 'prev');
                }}
                disabled={pdfStates[announcement.id]?.currentPage === 1}
                className="w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm shadow-md flex items-center justify-center hover:bg-white hover:scale-110 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
                </svg>
              </button>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  handlePageChange(announcement.id, 'next');
                }}
                disabled={pdfStates[announcement.id]?.currentPage === pdfStates[announcement.id]?.numPages}
                className="w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm shadow-md flex items-center justify-center hover:bg-white hover:scale-110 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
            {pdfStates[announcement.id] && (
              <div className="absolute bottom-2 right-2 bg-black/60 backdrop-blur-sm text-white text-xs px-3 py-1.5 rounded-full">
                {pdfStates[announcement.id].currentPage} / {pdfStates[announcement.id].numPages}
              </div>
            )}
          </div>
          <div className="flex-1 relative">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-300">{announcement.title}</h3>
                <p className="text-gray-500 mt-1">{announcement.institution}</p>
              </div>
              <span className={`px-4 py-2 rounded-full text-sm font-semibold shadow-sm ${
                announcement.status === '모집중' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 ring-1 ring-green-200 dark:ring-green-700' :
                announcement.status === '모집예정' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 ring-1 ring-blue-200 dark:ring-blue-700' :
                'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200 ring-1 ring-gray-200 dark:ring-gray-700'
              }`}>
                {announcement.status}
              </span>
            </div>
            <div className="mt-8 grid grid-cols-2 gap-6 text-sm">
              <div className="space-y-2 group/item">
                <p className="text-gray-500 dark:text-gray-400 group-hover/item:text-blue-500 dark:group-hover/item:text-blue-400 transition-colors duration-300 font-medium">공급대상</p>
                <p className="text-gray-900 dark:text-gray-100 font-semibold">{announcement.targetGroup}</p>
              </div>
              <div className="space-y-2 group/item">
                <p className="text-gray-500 dark:text-gray-400 group-hover/item:text-blue-500 dark:group-hover/item:text-blue-400 transition-colors duration-300 font-medium">신청자격</p>
                <p className="text-gray-900 dark:text-gray-100 font-semibold">{announcement.eligibility}</p>
              </div>
              <div className="space-y-2 group/item">
                <p className="text-gray-500 dark:text-gray-400 group-hover/item:text-blue-500 dark:group-hover/item:text-blue-400 transition-colors duration-300 font-medium">모집일정</p>
                <p className="text-gray-900 dark:text-gray-100 font-semibold">{announcement.schedule}</p>
              </div>
              <div className="space-y-2 group/item">
                <p className="text-gray-500 dark:text-gray-400 group-hover/item:text-blue-500 dark:group-hover/item:text-blue-400 transition-colors duration-300 font-medium">모집위치</p>
                <p className="text-gray-900 dark:text-gray-100 font-semibold">{announcement.location}</p>
              </div>
              <div className="space-y-2 group/item">
                <p className="text-gray-500 dark:text-gray-400 group-hover/item:text-blue-500 dark:group-hover/item:text-blue-400 transition-colors duration-300 font-medium">모집 세대수</p>
                <p className="text-gray-900 dark:text-gray-100 font-semibold">{announcement.totalHouseholds}세대</p>
              </div>
              <div className="space-y-2 group/item">
                <p className="text-gray-500 dark:text-gray-400 group-hover/item:text-blue-500 dark:group-hover/item:text-blue-400 transition-colors duration-300 font-medium">전용면적</p>
                <p className="text-gray-900 dark:text-gray-100 font-semibold">{announcement.floorArea}</p>
              </div>
              <div className="space-y-2 group/item">
                <p className="text-gray-500 dark:text-gray-400 group-hover/item:text-blue-500 dark:group-hover/item:text-blue-400 transition-colors duration-300 font-medium">임대기간</p>
                <p className="text-gray-900 dark:text-gray-100 font-semibold">{announcement.leasePeriod}</p>
              </div>
              <div className="space-y-2 group/item">
                <p className="text-gray-500 dark:text-gray-400 group-hover/item:text-blue-500 dark:group-hover/item:text-blue-400 transition-colors duration-300 font-medium">건물종류</p>
                <p className="text-gray-900 dark:text-gray-100 font-semibold">{announcement.buildingType}</p>
              </div>
            </div>
            <div className="mt-8">
              <a
                href={announcement.pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 bg-blue-50 text-blue-700 dark:bg-blue-900 dark:text-blue-200 rounded-full text-sm font-semibold hover:bg-blue-100 dark:hover:bg-blue-800 transition-all duration-300 hover:translate-x-1 hover:shadow-md"
              >
                공고문 PDF 보기
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      ))}
      {selectedPdf && (
        <PdfModal
          pdfUrl={selectedPdf}
          isOpen={!!selectedPdf}
          onClose={() => setSelectedPdf(null)}
        />
      )}
    </div>
  );
} 