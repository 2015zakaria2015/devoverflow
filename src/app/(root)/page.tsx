import React from "react";
import { Button } from "@/src/components/ui/button";
import Link from "next/link";
import ROUTES from "@/constants/routes";
import LocalSearch from "@/src/components/search/LocalSearch";
import HomeFilter from "@/src/components/filters/HomeFilter";
import QuestionCard from "@/src/components/cards/QuestionCard";
import { ValidationError } from "@/src/lib/http-errors";
import dbConnect from "@/src/lib/mongoose";
import handleError from "@/src/lib/handlers/error";

const questions = [
  {
    _id: "1",
    title: "Understanding React Hooks",
    description:
      "I'm new to React and struggling to understand how hooks work. Can someone explain useEffect and useState?",
    tags: [
      { _id: "1", name: "React" },
      { _id: "2", name: "React" },
    ],
    author: {
      _id: "1",
      name: "Alice Smith",
      image:
        "https://sm.ign.com/ign_fr/cover/a/avatar-gen/avatar-generations_bssq.jpg",
    },
    upvotes: 15,
    answers: 7,
    views: 150,
    createdAt: "2023-10-01T10:00:00.000Z",
  },
  {
    _id: "2",
    title: "Best Practices for CSS in javascript",
    description:
      "What are the best practices for organizing and writing CSS in a React application?",
    tags: [
      { _id: "1", name: "Javascript" },
      { _id: "2", name: "Javascript" },
    ],
    author: {
      _id: "2",
      name: "Bob Johnson",
      image:
        "https://sm.ign.com/ign_fr/cover/a/avatar-gen/avatar-generations_bssq.jpg",
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
      image:
        "https://sm.ign.com/ign_fr/cover/a/avatar-gen/avatar-generations_bssq.jpg",
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
      image:
        "https://sm.ign.com/ign_fr/cover/a/avatar-gen/avatar-generations_bssq.jpg",
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

const test = async () => {
  try {
    await dbConnect();
  } catch (error) {
    return handleError(error);
  }
};



const HomePage = async ({ searchParams }: SearchParams) => {
  const result = await test();
  console.log(result);
  const { query = "", filter = "" } = await searchParams;

  const filteredQuestions = questions.filter((question) => {
    const matchesQuery = question.title
      .toLowerCase()
      .includes(query.toLowerCase());

    const matchesFilter = filter
      ? question.tags[0].name.toLowerCase() === filter.toLowerCase()
      : true;
    return matchesQuery && matchesFilter;
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
      <HomeFilter />
      <div className="mt-10 flex w-full flex-col gap-6">
        {filteredQuestions.map((question) => (
          <QuestionCard key={question._id} question={question} />
        ))}
      </div>
    </>
  );
};

export default HomePage;
