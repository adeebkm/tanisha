import React, { useState, useMemo, useEffect } from 'react';
import { TopBar } from './components/TopBar';
import { Tabs } from './components/Tabs';
import { ResultCard } from './components/ResultCard';
import { LinkedInProfileView as LinkedInProfile } from './components/LinkedInProfile';
import { FacebookProfileView as FacebookProfile } from './components/FacebookProfile';
import { PeopleAlsoSearchFor } from './components/PeopleAlsoSearchFor';
import { ImagesSection } from './components/ImagesSection';
import {
  RESULTS_Tanisha_Jefferson,
  type SimResult
} from './data/results';
import { getRelatedSearches } from './data/relatedSearches';
import { trackPageView, trackTabChange, trackPagination, trackSearch, trackResultClick } from './utils/tracking';

interface GoogleSimulationProps {
  searchType?: 'tanisha';
}

const GoogleSimulation: React.FC<GoogleSimulationProps> = ({ searchType = 'tanisha' }) => {
  const [searchQuery, setSearchQuery] = useState('Tanisha Jefferson');
  const [activeTab, setActiveTab] = useState('All');
  const [selectedResult, setSelectedResult] = useState<SimResult | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isMobile, setIsMobile] = useState(false);
  const resultsPerPage = 10;

  // Force light mode as requested
  const isDark = false;

  // Check for mobile viewport
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Reset to first page when activeTab changes
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab]);

  // Track page view on mount
  useEffect(() => {
    trackPageView('tanisha', currentPage, activeTab);
  }, []);

  // Track tab changes
  useEffect(() => {
    if (activeTab) {
      trackTabChange(activeTab, 'tanisha');
    }
  }, [activeTab]);

  // Track pagination
  useEffect(() => {
    if (currentPage > 1) {
      trackPagination(currentPage, 'tanisha');
    }
  }, [currentPage]);

  // Get results for Tanisha
  const allResults = useMemo(() => {
    return RESULTS_Tanisha_Jefferson;
  }, []);

  // Filter results by active tab
  const filteredResults = useMemo(() => {
    let filtered = allResults;
    if (activeTab !== 'All' && activeTab !== 'Videos' && activeTab !== 'Images' && activeTab !== 'News' && activeTab !== 'Short videos' && activeTab !== 'Shopping') {
      filtered = filtered.filter(result => result.platform === activeTab);
    }
    return filtered;
  }, [allResults, activeTab]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredResults.length / resultsPerPage);
  const startIndex = (currentPage - 1) * resultsPerPage;
  const endIndex = startIndex + resultsPerPage;
  const paginatedResults = filteredResults.slice(startIndex, endIndex);

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 10;
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage <= 4) {
        for (let i = 2; i <= 5; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 3) {
        pages.push('...');
        for (let i = totalPages - 4; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push('...');
        pages.push(currentPage - 1);
        pages.push(currentPage);
        pages.push(currentPage + 1);
        pages.push('...');
        pages.push(totalPages);
      }
    }
    return pages;
  };

  // Safety check
  if (!allResults || allResults.length === 0) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h1>No results found</h1>
        <p>Tanisha Jefferson results are not available.</p>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#fff' }}>
      <TopBar searchQuery={searchQuery} onSearchChange={setSearchQuery} isDark={isDark} />
      <Tabs activeTab={activeTab} onTabChange={setActiveTab} isDark={isDark} />

      <div style={{ maxWidth: '1128px', margin: '0 auto', padding: isMobile ? '0 8px' : '0 16px' }}>
        {/* Back to survey button - outside the results column */}
        <div style={{ paddingTop: isMobile ? '12px' : '20px', paddingBottom: '8px' }}>
          <button
            onClick={(e) => {
              e.preventDefault();
              // Non-functional for now
            }}
            style={{
              backgroundColor: '#1a73e8',
              border: 'none',
              borderRadius: '24px',
              padding: '12px 24px',
              cursor: 'pointer',
              color: '#fff',
              fontWeight: 600,
              fontSize: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              whiteSpace: 'nowrap',
              boxShadow: '0 2px 8px rgba(26, 115, 232, 0.4)',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#1557b0'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(26, 115, 232, 0.5)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#1a73e8'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(26, 115, 232, 0.4)'; }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            <span>Back to survey</span>
          </button>
        </div>
        <div style={{ display: 'flex', gap: isMobile ? '0' : '32px' }}>
          {/* Main Results Column */}
          <div style={{ flex: '1', minWidth: 0, width: '100%' }}>
            {/* Results Count */}
            <div style={{ color: '#70757a', fontSize: '14px', marginBottom: '16px' }}>
              About {filteredResults.length} results
            </div>

            {/* Results List */}
            {filteredResults.length === 0 ? (
              <div style={{ padding: '40px 0', textAlign: 'center' }}>
                <p style={{ color: '#70757a', fontSize: '16px' }}>
                  No results found. Try adjusting your search or filters.
                </p>
              </div>
            ) : (
              <div>
                {paginatedResults.map((result, index) => {
                  const shouldShowTanishaImages = currentPage === 1 && index === 0;
                  
                  return (
                    <React.Fragment key={result.id}>
                      {shouldShowTanishaImages && (
                        <ImagesSection
                          images={[
                            {
                              id: 'tanisha-img-1',
                              title: 'Tanisha Jefferson – LinkedIn',
                              source: 'LinkedIn',
                              imageUrl: 'https://media.licdn.com/dms/image/v2/C4D03AQGv2Fb6sA2XSA/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1572534569543?e=2147483647&v=beta&t=wL_Mych4iW6jEeAGsb8a6wRST-aBDq7tWdpH9Vszt9M'
                            },
                            {
                              id: 'tanisha-img-2',
                              title: 'Tanisha Jefferson – Professional Profile',
                              source: 'Professional Network',
                              imageUrl: 'https://www.courier-journal.com/gcdn/-mm-/ce8b541bd9edf06175cce0204e99bd4b524a6f29/c=0-83-996-1411/local/-/media/2017/09/08/Louisville/Louisville/636404646455746707-LCJBrd2-10-20-2016-KY-1-A013--2016-10-19-IMG-Tanisha-Ann-Hickerso-1-1-OSG1EJAD-L903633790-IMG-Tanisha-Ann-Hickerso-1-1-OSG1EJAD.jpg?width=458&height=610&fit=crop&format=pjpg&auto=webp'
                            },
                            {
                              id: 'tanisha-img-3',
                              title: 'Tanisha Jefferson – Profile',
                              source: 'Social Media',
                              imageUrl: '/Photos/Race - Black - Female/1716b819-83d5-41b9-93f8-2d2bf47c87a5.jpg'
                            }
                          ]}
                          isDark={isDark}
                        />
                      )}
                      <ResultCard
                        result={result}
                        onOpen={(result) => {
                          // Track the click for all results
                          trackResultClick(result.id, result.platform, result.displayName, 'tanisha');
                          // Only open LinkedIn and Facebook profiles
                          if (result.platform === 'LinkedIn' || result.platform === 'Facebook') {
                            setSelectedResult(result);
                          }
                        }}
                        isDark={isDark}
                      />
                    </React.Fragment>
                  );
                })}
              </div>
            )}

            {/* Pagination Controls */}
            {filteredResults.length > 0 && totalPages > 1 && (
              <div style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center',
                gap: '4px',
                marginTop: '32px',
                marginBottom: '32px',
                paddingTop: '20px',
                borderTop: '1px solid #ebebeb'
              }}>
                {currentPage > 1 && (
                  <button
                    onClick={() => setCurrentPage(currentPage - 1)}
                    style={{
                      padding: '8px 16px',
                      border: '1px solid #dadce0',
                      borderRadius: '4px',
                      backgroundColor: 'transparent',
                      color: '#1a0dab',
                      fontSize: '14px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <span>‹</span> Previous
                  </button>
                )}

                {getPageNumbers().map((page, index) => {
                  if (page === '...') return <span key={`ellipsis-${index}`} style={{ padding: '0 8px', color: '#70757a' }}>...</span>;
                  const pageNum = page as number;
                  const isActive = pageNum === currentPage;
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      style={{
                        minWidth: '40px',
                        height: '40px',
                        padding: '0 8px',
                        border: '1px solid #dadce0',
                        borderRadius: '4px',
                        backgroundColor: isActive ? '#1a0dab' : 'transparent',
                        color: isActive ? '#fff' : '#1a0dab',
                        fontSize: '14px',
                        cursor: 'pointer',
                        fontWeight: isActive ? 500 : 400
                      }}
                    >
                      {pageNum}
                    </button>
                  );
                })}

                {currentPage < totalPages && (
                  <button
                    onClick={() => setCurrentPage(currentPage + 1)}
                    style={{
                      padding: '8px 16px',
                      border: '1px solid #dadce0',
                      borderRadius: '4px',
                      backgroundColor: 'transparent',
                      color: '#1a0dab',
                      fontSize: '14px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    Next <span>›</span>
                  </button>
                )}
              </div>
            )}

            {/* People Also Search For */}
            {activeTab === 'All' && filteredResults.length > 0 && (
              <PeopleAlsoSearchFor 
                searches={getRelatedSearches(searchQuery || 'Michael Johnson')} 
                searchQuery={searchQuery}
                onSearchClick={setSearchQuery}
              />
            )}
          </div>
        </div>
      </div>

      {/* LinkedIn Profile or Facebook Profile */}
      {selectedResult && selectedResult.platform === 'LinkedIn' && (
        <LinkedInProfile
          resultId={selectedResult.id}
          onClose={() => setSelectedResult(null)}
        />
      )}
      {selectedResult && selectedResult.platform === 'Facebook' && (
        <FacebookProfile
          resultId={selectedResult.id}
          onClose={() => setSelectedResult(null)}
        />
      )}
    </div>
  );
};

export default GoogleSimulation;
