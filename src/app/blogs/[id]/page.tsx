"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import {
    ArrowLeft,
    Calendar,
    Clock,
    Heart,
    MessageCircle,
    Share2,
    Home,
    ChevronRight
} from 'lucide-react';
import Navbar from '../../../../components/navbar';

interface DevToArticle {
    id: number;
    title: string;
    description: string;
    body_html: string;
    body_markdown: string;
    url: string;
    canonical_url: string;
    published_at: string;
    edited_at: string | null;
    tag_list: string[];
    tags: string;
    slug: string;
    path: string;
    cover_image: string;
    social_image: string;
    user: {
        id: number;
        name: string;
        username: string;
        twitter_username: string | null;
        github_username: string | null;
        website_url: string | null;
        profile_image: string;
        profile_image_90: string;
    };
    organization?: {
        name: string;
        username: string;
        slug: string;
        profile_image: string;
        profile_image_90: string;
    };
    reading_time_minutes: number;
    public_reactions_count: number;
    comments_count: number;
    positive_reactions_count: number;
    page_views_count: number;
}

interface RelatedArticle {
    id: number;
    title: string;
    url: string;
    user: {
        name: string;
        username: string;
        profile_image_90: string;
    };
    tag_list: string[];
    published_at: string;
    cover_image: string;
}

export default function BlogDetail() {
    const params = useParams();
    const router = useRouter();
    const [article, setArticle] = useState<DevToArticle | null>(null);
    const [relatedArticles, setRelatedArticles] = useState<RelatedArticle[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const articleId = params.id as string;

    useEffect(() => {
        const fetchArticle = async () => {
            try {
                setLoading(true);
                setError(null);

                // Fetch the main article
                const articleResponse = await fetch(`https://dev.to/api/articles/${articleId}`);

                if (!articleResponse.ok) {
                    throw new Error('Article not found');
                }

                const articleData: DevToArticle = await articleResponse.json();
                setArticle(articleData);

                // Fetch related articles based on tags
                if (articleData.tag_list.length > 0) {
                    const tag = articleData.tag_list[0];
                    const relatedResponse = await fetch(`https://dev.to/api/articles?tag=${tag}&per_page=4`);

                    if (relatedResponse.ok) {
                        const relatedData: RelatedArticle[] = await relatedResponse.json();
                        // Filter out the current article from related articles
                        const filtered = relatedData.filter(related => related.id !== articleData.id);
                        setRelatedArticles(filtered.slice(0, 3));
                    }
                }

            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to load article');
                console.error('Error fetching article:', err);
            } finally {
                setLoading(false);
            }
        };

        if (articleId) {
            fetchArticle();
        }
    }, [articleId]);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const handleShare = async () => {
        if (navigator.share && article) {
            try {
                await navigator.share({
                    title: article.title,
                    text: article.description,
                    url: window.location.href,
                });
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
            } catch (err) {
                // Fallback to copying to clipboard
                navigator.clipboard.writeText(window.location.href);
                alert('Link copied to clipboard!');
            }
        } else if (article) {
            navigator.clipboard.writeText(window.location.href);
            alert('Link copied to clipboard!');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Navbar />
                <div className="flex items-center justify-center h-64">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                        <p className="text-gray-600">Loading article...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error || !article) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Navbar />
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="text-center">
                        <h1 className="text-2xl font-bold text-gray-900 mb-4">Article Not Found</h1>
                        <p className="text-gray-600 mb-6">{error || 'The article you are looking for does not exist.'}</p>
                        <button
                            onClick={() => router.push('/blog')}
                            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Back to Blog
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Breadcrumb */}
                <div className="flex items-center space-x-2 text-sm text-gray-600 mb-8">
                    <Home className="w-4 h-4" />
                    <span>Home</span>
                    <ChevronRight className="w-4 h-4" />
                    <button
                        onClick={() => router.push('/blog')}
                        className="text-blue-600 hover:text-blue-700"
                    >
                        Blog
                    </button>
                    <ChevronRight className="w-4 h-4" />
                    <span className="text-gray-900 font-medium truncate">{article.title}</span>
                </div>

                {/* Back Button */}
                <button
                    onClick={() => router.back()}
                    className="flex items-center text-blue-600 hover:text-blue-700 mb-6 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to blogs
                </button>

                {/* Article Header */}
                <header className="mb-8">
                    {/* Tags */}



                    {/* Title */}
                    <h1 className="text-4xl font-bold text-gray-900 mb-4 leading-tight">
                        {article.title}
                    </h1>

                 

                    {/* Meta Information */}
                    <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600 mb-6">
                        <div className="flex items-center">
                            <Image
                                width={90}
                                height={90}
                                src={article.user.profile_image_90}
                                alt={article.user.name}
                                className="w-10 h-10 rounded-full mr-3"
                            />
                            <div>
                                <p className="font-medium text-gray-900">{article.user.name}</p>
                                <p className="text-sm">@{article.user.username}</p>
                            </div>
                        </div>

                        <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            {formatDate(article.published_at)}
                        </div>

                        <div className="flex items-center">
                            <Clock className="w-4 h-4 mr-1" />
                            {article.reading_time_minutes} min read
                        </div>

                        <div className="flex items-center">
                            <Heart className="w-4 h-4 mr-1" />
                            {article.positive_reactions_count} reactions
                        </div>

                        <div className="flex items-center">
                            <MessageCircle className="w-4 h-4 mr-1" />
                            {article.comments_count} comments
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-4 mb-8">
                        <button
                            onClick={handleShare}
                            className="flex items-center px-4 py-2 bg-blue-400 text-white rounded-lg  transition-colors"
                        >
                            <Share2 className="w-4 h-4 mr-2" />
                            Share
                        </button>
                    </div>
                </header>

                {/* Cover Image */}
                {article.cover_image && (
                    <div className="mb-8">
                        <Image
                            priority
                            width={90}
                            height={90}
                            src={article.cover_image}
                            alt={article.title}
                            className="w-full h-96 object-cover rounded-lg shadow-lg"
                        />
                    </div>
                )}

                {/* Article Content */}
                <article className="bg-white rounded-lg shadow-sm p-8 mb-12">
                    <div
                        className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline prose-strong:text-gray-900 prose-code:text-pink-600 prose-code:bg-gray-100 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-pre:bg-gray-900 prose-pre:text-gray-100"
                        dangerouslySetInnerHTML={{ __html: article.body_html }}
                    />
                </article>


                {/* Related Articles */}
                {relatedArticles.length > 0 && (
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <h3 className="text-xl font-semibold text-gray-900 mb-6">Related Articles</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {relatedArticles.map(related => (
                                <div
                                    key={related.id}
                                    onClick={() => router.push(`/blog/${related.id}`)}
                                    className="cursor-pointer group"
                                >
                                    {related.cover_image && (
                                        <Image
                                            width={90}
                                            height={90}
                                            src={related.cover_image}
                                            alt={related.title}
                                            className="w-full h-32 object-cover rounded-lg mb-3 group-hover:opacity-90 transition-opacity"
                                        />
                                    )}
                                    <h4 className="font-medium text-gray-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                                        {related.title}
                                    </h4>
                                    <div className="flex items-center text-sm text-gray-600">
                                        <Image
                                            width={50}
                                            height={50}
                                            src={related.user.profile_image_90}
                                            alt={related.user.name}
                                            className="w-4 h-4 rounded-full mr-2"
                                        />
                                        {related.user.name}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}