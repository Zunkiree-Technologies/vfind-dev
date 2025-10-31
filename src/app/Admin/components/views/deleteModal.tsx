"use client";

import { AlertTriangle } from "lucide-react";

interface DeleteModalProps {
    open: boolean;
    nurseName?: string;
    onCancel: () => void;
    onConfirm: () => void;
}

export default function DeleteModal({
    open,
    nurseName,
    onCancel,
    onConfirm,
}: DeleteModalProps) {
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <div className="bg-white rounded-lg shadow-lg w-[500px] p-6 text-center">
                {/* Icon */}
                <div className="flex justify-center mb-4">
                    <div className="bg-[#FFECEA] p-3 rounded-full">
                        <AlertTriangle className="w-6 h-6 text-[#B94A48]" />
                    </div>
                </div>

                {/* Title */}
                <h2 className="text-lg font-semibold mb-[8px] text-gray-900">
                    Delete Nurse Record
                </h2>

                {/* Subtitle + Buttons */}
                <div className="w-[400px] max-w-md mx-auto text-center">
                    <div className="flex flex-col">
                        {/* Subtitle */}
                        <p className="text-sm text-[#646465] mb-4">
                            Are you sure you want to delete{" "}
                            {nurseName ? `${nurseName}'s` : "this"} record?
                            <br />
                            This action cannot be undone.
                        </p>

                        {/* Buttons */}
                        <div className="flex justify-between mt-[4px]">
                            <button
                                onClick={onCancel}
                                className="px-12 py-2 rounded-md bg-[#F5F6FA] text-gray-700 font-medium hover:bg-gray-200 transition"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={onConfirm}
                                className="px-12 py-2 rounded-md bg-[#D9796C] text-white font-medium hover:bg-[#c36c60] transition"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}