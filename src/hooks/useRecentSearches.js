import { useState, useCallback } from 'react';

export const useRecentSearches = (setSearchKeyword) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [showList, setShowList] = useState(false)
    const [recentSearches, setRecentSearches] = useState(() => {
        const savedSearches = localStorage.getItem('recentSearches');
        return savedSearches ? JSON.parse(savedSearches) : [];
    });

    const handleSearch = useCallback((term)=> {
        if (!recentSearches.includes(term)) {
            const updatedSearches = [term, ...recentSearches].slice(0, 5);
            setRecentSearches(updatedSearches);
            localStorage.setItem('recentSearches', JSON.stringify(updatedSearches));
        }
        setSearchKeyword(term);
        setSearchTerm(term);
        setShowList(false)
    }, [setSearchKeyword, recentSearches]);

    return {
        searchTerm,
        setSearchTerm,
        recentSearches,
        handleSearch,
        showList,
        setShowList
    };
};
