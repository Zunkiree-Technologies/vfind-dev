"use client";

import { useState, useEffect } from 'react';
import { Search, User, ChevronLeft, ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Navbar from '../../../components/navbar';
import Footer from '../../../components/footer-section';
import Image from 'next/image';
import React from 'react';

interface DevToArticle {
    id: number;
    title: string;
    description: string;
    url: string;
    published_at: string;
    tag_list: string[];
    cover_image: string;
    user: {
        name: string;
        username: string;
        profile_image: string;
    };
    organization?: {
        name: string;
        username: string;
        profile_image: string;
    };
    reading_time_minutes: number;
    public_reactions_count: number;
}

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

// Pagination Component
const Pagination: React.FC<PaginationProps> = ({
    currentPage,
    totalPages,
    onPageChange,
}) => {
    const getVisiblePages = () => {
        const delta = 2;
        const range: (number | string)[] = [];
        const rangeWithDots: (number | string)[] = [];

        for (
            let i = Math.max(2, currentPage - delta);
            i <= Math.min(totalPages - 1, currentPage + delta);
            i++
        ) {
            range.push(i);
        }

        if (currentPage - delta > 2) {
            rangeWithDots.push(1, "...");
        } else {
            rangeWithDots.push(1);
        }

        rangeWithDots.push(...range);

        if (currentPage + delta < totalPages - 1) {
            rangeWithDots.push("...", totalPages);
        } else if (totalPages > 1) {
            rangeWithDots.push(totalPages);
        }

        return rangeWithDots;
    };

    if (totalPages <= 1) return null;

    return (
        <div className="flex items-center justify-center gap-2 mt-8 mb-6">
            {/* Previous Button */}
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    currentPage === 1
                        ? "text-gray-400 cursor-not-allowed"
                        : "text-gray-600 hover:bg-gray-100"
                }`}
            >
                <ChevronLeft size={16} />
                Previous
            </button>

            {/* Page Numbers */}
            <div className="flex items-center gap-1">
                {getVisiblePages().map((page, index) => (
                    <React.Fragment key={index}>
                        {page === "..." ? (
                            <span className="px-3 py-2 text-gray-400">...</span>
                        ) : (
                            <button
                                onClick={() => onPageChange(page as number)}
                                className={`w-10 h-10 rounded-full text-sm font-medium transition-all duration-200 ${
                                    currentPage === page
                                        ? "bg-gray-900 text-white"
                                        : "text-gray-600 hover:bg-gray-100"
                                }`}
                            >
                                {page}
                            </button>
                        )}
                    </React.Fragment>
                ))}
            </div>

            {/* Next Button */}
            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    currentPage === totalPages
                        ? "text-gray-400 cursor-not-allowed"
                        : "text-gray-600 hover:bg-gray-100"
                }`}
            >
                Next
                <ChevronRight size={16} />
            </button>
        </div>
    );
};

export default function Blogs() {
    const [searchTerm, setSearchTerm] = useState('');
    const [articles, setArticles] = useState<DevToArticle[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const articlesPerPage = 6;
    const router = useRouter();

    // Fetch articles from Dev.to API
    useEffect(() => {
        const fetchArticles = async () => {
            try {
                setLoading(true);
                const response = await fetch('https://dev.to/api/articles?per_page=20&top=7');

                if (!response.ok) {
                    throw new Error('Failed to fetch articles');
                }

                const data: DevToArticle[] = await response.json();
                setArticles(data);
                setError(null);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An error occurred');
                console.error('Error fetching articles:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchArticles();
    }, []);

    // Filter articles based on search
    const filteredArticles = articles.filter(article => {
        const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            article.description.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesSearch;
    });

    // Get unique authors count
    const uniqueAuthors = new Set(articles.map(article => article.user.username));

    // Pagination logic
    const indexOfLastArticle = currentPage * articlesPerPage;
    const indexOfFirstArticle = indexOfLastArticle - articlesPerPage;
    const currentArticles = filteredArticles.slice(indexOfFirstArticle, indexOfLastArticle);
    const totalPages = Math.ceil(filteredArticles.length / articlesPerPage);

    const handleBlogClick = (id: number) => {
        // Navigate to your [id] page
        router.push(`/blogs/${id}`);
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const handlePageChange = (pageNumber: number) => {
        setCurrentPage(pageNumber);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Navbar />
                <div className="flex items-center justify-center h-64">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                        <p className="text-gray-600">Loading articles...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Navbar />
                <div className="flex items-center justify-center h-64">
                    <div className="text-center">
                        <p className="text-red-600 mb-4">Error: {error}</p>
                        <button 
                            onClick={() => window.location.reload()}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                        >
                            Retry
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Navbar */}
            <Navbar />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Header */}
                <div className="mb-12">
                    <h1 className="text-3xl font-bold text-blue-400">VFind Insights: Career, Hiring & Growth</h1>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-3">
                        {/* Blog Cards */}
                        <div className="space-y-6 mb-8">
                            {currentArticles.map(article => (
                                <div
                                    key={article.id}
                                    onClick={() => handleBlogClick(article.id)}
                                    className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                                >
                                    <div className="flex">
                                        {/* Thumbnail */}
                                        <div className="relative flex-shrink-0 w-48 h-40">
                                            <Image
                                                src={article.cover_image || '/api/placeholder/300/200'}
                                                alt={article.title}
                                                fill
                                                className="object-cover"
                                                onError={(e) => {
                                                    const target = e.target as HTMLImageElement;
                                                    target.src = '/api/placeholder/300/200';
                                                }}
                                            />
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1 p-6">
                                            <h2 className="text-xl font-semibold text-gray-900 mb-3 hover:text-blue-600 transition-colors">
                                                {article.title}
                                            </h2>

                                            <div className="flex items-center gap-3 text-sm text-gray-600 mb-3">
                                                <span>{formatDate(article.published_at)}</span>
                                                <span className="flex items-center gap-1">
                                                    <User className="w-4 h-4" />
                                                    {article.user.name}
                                                </span>
                                                <span>|</span>
                                                <span>{article.reading_time_minutes} min read</span>
                                                <span>|</span>
                                                <span>{article.public_reactions_count} reactions</span>
                                            </div>

                                            <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                                                {article.description}
                                            </p>

                                            <button className="text-blue-400 text-sm font-medium ">
                                                Read more...
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <Pagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPageChange={handlePageChange}
                            />
                        )}

                        {filteredArticles.length === 0 && !loading && (
                            <div className="text-center py-12">
                                <p className="text-gray-500 text-lg">No blog posts found matching your search.</p>
                            </div>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="space-y-6">
                            {/* Search */}
                            <div className="bg-white rounded-lg border border-gray-200 p-6">
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="Search blogs here"
                                        value={searchTerm}
                                        onChange={(e) => {
                                            setSearchTerm(e.target.value);
                                            setCurrentPage(1); // Reset to first page on search
                                        }}
                                        className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                    />
                                    <Search className="absolute right-3 top-2.5 w-5 h-5 text-gray-400" />
                                </div>
                            </div>

                            {/* Blog Stats */}
                            <div className="bg-white rounded-lg border border-gray-200 p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Blog Stats</h3>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600 text-sm">Total Articles:</span>
                                        <span className="font-semibold text-gray-900">{articles.length}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600 text-sm">Authors:</span>
                                        <span className="font-semibold text-gray-900">{uniqueAuthors.size}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <Footer />
        </div>
    );
}