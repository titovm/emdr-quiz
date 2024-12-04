import React from "react";

interface QuestionProps {
    number: number;
    question: string;
  }
  
  export default function QuestionItem({ number, question }: QuestionProps) {
    return (
      <div className="flex items-start space-x-4 mb-6">
        <div className="flex-shrink-0">
          <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-green-100 text-green-800 font-semibold text-lg">
            {number}
          </span>
        </div>
        <p className="text-lg text-gray-700 font-medium mt-0.5">
          {question}
        </p>
      </div>
    )
  }
  
  