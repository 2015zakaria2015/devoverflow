import ROUTES from "@/constants/routes";
import Link from "next/link";
import Image from "next/image";
import React from "react";
import TagCard from "../cards/TagCard";
import { getDeviconsClassName } from "@/src/lib/utils";

const hotQuestions = [
  { _id: 1, title: "How to create a custom hook in React?" },
  { _id: 2, title: "How to use React Router?" },
  { _id: 3, title: "How to use React Context?" },
  { _id: 4, title: "How to use Redux in React?" },
  { _id: 5, title: "How to use React Context?" },
  { _id: 6, title: "How to use React Context?" },
];


const popularTags = [
    {_id:1 , name:'react' , questions: 100},
    {_id:2 , name:'javascript' , questions: 200},
    {_id:3 , name:'typescript' , questions: 300},
    {_id:4 , name:'nodejs' , questions: 400},
    {_id:5 , name:'nextjs' , questions: 500},
    {_id:6 , name:'vuejs' , questions: 600},
    {_id:7 , name:'figma' , questions: 700},
    {_id:8 , name:'react-query' , questions: 800},

]
const RightSidebar = () => {

  return (
    <section className="pt-36 custom-scrollbar background-light900_dark200 light-border sticky right-0 top-0 flex h-screen w-[350px] flex-col gap-6 overflow-y-auto border-l p-6 shadow-light-300 dark:shadow-none max-xl:hidden ">
      <div>
        <h3 className="h3-bold text-dark200_light900">Top Questions </h3>

        <div className="mt-7 flex w-full flex-col gap-[30px]">
          {hotQuestions.map(({ _id, title }) => (
            <Link
              key={_id}
              href={ROUTES.PROFILE(String(_id))}
              className="flex cursor-pointer items-center justify-between gap-7"
            >
              <p className="body-medium text-dark500_light700">{title}</p>

              <Image
                src="/icons/chevron-right.svg"
                width={20}
                height={20}
                alt="chevron-right"
                className="invert-colors"
              />
            </Link>
          ))}
        </div>
      </div>

      <div className="mt-16">
        <h3 className="h3-bold text-dark200_light900">Popular Tags </h3>

        <div className="mt-7 flex flex-col gap-4 ">

            {popularTags.map(({_id , name , questions}) => (
                <TagCard key={_id} _id={String(_id)} name={name} questions={questions} showCount={true} />
            )
            )}

        </div>

      </div>
    </section>
  );
};

export default RightSidebar;
