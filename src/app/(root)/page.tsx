import React from "react";
import { Button } from "@/src/components/ui/button";
import Link from "next/link";
import ROUTES from "@/constants/routes";
import LocalSearch from "@/src/components/search/LocalSearch";

const questions = [
  {
    _id: "1",
    title: "Understanding React Hooks",
    description:
      "I'm new to React and struggling to understand how hooks work. Can someone explain useEffect and useState?",
    tags: [
      { _id: "1", name: "React" },
      { _id: "2", name: "Hooks" },
      { _id: "3", name: "useEffect" },
      { _id: "4", name: "useState" },
      { _id: "5", name: "JavaScript" },
    ],
    author: {
      _id: "1",
      name: "Alice Smith",
    },
    upvotes: 15,
    answers: 7,
    views: 150,
    createdAt: "2023-10-01T10:00:00.000Z",
  },
  {
    _id: "2",
    title: "Best Practices for CSS in React",
    description:
      "What are the best practices for organizing and writing CSS in a React application?",
    tags: [
      { _id: "1", name: "React" },
      { _id: "2", name: "CSS" },
      { _id: "3", name: "Styling" },
      { _id: "4", name: "Web Development" },
    ],
    author: {
      _id: "2",
      name: "Bob Johnson",
    },
    upvotes: 20,
    answers: 10,
    views: 200,
    createdAt: "2023-11-01T11:00:00.000Z",
  },
  {
    _id: "3",
    title: "Handling Forms in React",
    description:
      "I need help with handling form submissions in React. What's the best way to manage form state and validation?",
    tags: [
      { _id: "1", name: "React" },
      { _id: "2", name: "Forms" },
      { _id: "3", name: "State Management" },
      { _id: "4", name: "Validation" },
    ],
    author: {
      _id: "3",
      name: "Charlie Brown",
    },
    upvotes: 12,
    answers: 6,
    views: 120,
    createdAt: "2023-12-01T12:00:00.000Z",
  },
  {
    _id: "4",
    title: "Optimizing Performance in React",
    description:
      "My React application is slow. What are some tips and tricks to optimize its performance?",
    tags: [
      { _id: "1", name: "React" },
      { _id: "2", name: "Performance" },
      { _id: "3", name: "Optimization" },
      { _id: "4", name: "Web Development" },
    ],
    author: {
      _id: "4",
      name: "Diana Prince",
    },
    upvotes: 25,
    answers: 12,
    views: 250,
    createdAt: "2023-09-01T13:00:00.000Z",
  },
];

interface SearchParams {
  searchParams: Promise<{ [key: string]: string }>;
}

const HomePage = async ({ searchParams }: SearchParams) => {
  const { query = "" } = await searchParams;

  const filterQuestions = questions.filter((question) => {
    return question.title.toLowerCase().includes(query.toLowerCase());
  });

  return (
    <>
      <section className="flex w-full flex-col-reverse justify-between gap-4 sm:flex-row sm:items-center">
        <h1 className="h1-bold text-dark100_light900">All Questions</h1>
        <Button
          className="primary-gradient min-h-[46px] px-4 py-3 !text-light-900"
          asChild
        >
          <Link href={ROUTES.ASK_QUESTION}>Ask a Question</Link>
        </Button>
      </section>
      <section className="mt-11">
        <LocalSearch
          route="/search"
          imgSrc="/icons/search.svg"
          placeholder="Search for questions"
          otherClasses="flex-1"
        />
      </section>
      <div className="mt-10 flex w-full flex-col gap-6">
        {filterQuestions.map((question) => (
          <h1 key={question._id}>{question.title}</h1>
        ))}
      </div>
    </>
  );
};

export default HomePage;
