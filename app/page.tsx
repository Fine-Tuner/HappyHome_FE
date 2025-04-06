import AnnouncementList from './components/AnnouncementList';
import { Announcement } from './types/announcement';

// 임시 데이터 - API 연동 후 삭제
const mockAnnouncements: Announcement[] = [
  {
    id: '1',
    title: '2024년 서울시 행복주택 1차 모집공고',
    institution: '서울특별시',
    announcementDate: '2024-04-01',
    applicationStartDate: '2024-04-15',
    applicationEndDate: '2024-04-30',
    status: '모집예정',
    location: '서울시 강남구',
    totalHouseholds: 100,
    pdfUrl: '/공고문_17779_20250405_135700.pdf',
    targetGroup: '청년, 신혼부부',
    eligibility: '무주택자, 소득기준 충족자',
    schedule: '2024-04-15 ~ 2024-04-30',
    floorArea: '전용 59㎡',
    leasePeriod: '2년',
    buildingType: '아파트'
  },
  {
    id: '2',
    title: '2024년 경기도 행복주택 2차 모집공고',
    institution: '경기도',
    announcementDate: '2024-03-25',
    applicationStartDate: '2024-04-01',
    applicationEndDate: '2024-04-15',
    status: '모집중',
    location: '경기도 수원시',
    totalHouseholds: 150,
    pdfUrl: '/공고문_17808_20250405_135646.pdf',
    targetGroup: '청년, 신혼부부, 다자녀가구',
    eligibility: '무주택자, 소득기준 충족자',
    schedule: '2024-04-01 ~ 2024-04-15',
    floorArea: '전용 84㎡',
    leasePeriod: '2년',
    buildingType: '오피스텔'
  }
];

export default function Home() {
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">행복주택 공고문</h1>
      <AnnouncementList announcements={mockAnnouncements} />
    </main>
  );
}
