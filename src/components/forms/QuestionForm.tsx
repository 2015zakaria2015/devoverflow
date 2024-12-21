"use client";
import React from "react";
import { Path, useForm } from "react-hook-form";
import { AskQuestionSchema } from "@/src/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRef } from "react";
import {
  Form,
  FormField,
  FormControl,
  FormItem,
  FormDescription,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import dynamic from "next/dynamic";
import { MDXEditorMethods } from "@mdxeditor/editor";
const QuestionForm = () => {

  // This is the only place InitializedMDXEditor is imported directly.
const Editor = dynamic(() => import('@/src/components/editor/index'), {
  // Make sure we turn SSR off
  ssr: false
})

  const editorRef = useRef<MDXEditorMethods>(null);
  const form = useForm({
    resolver: zodResolver(AskQuestionSchema),
    defaultValues: {
      title: "",
      content: "",
      tags: [],
    },
  });

  const handleCreateQuestion = (data) => {
    console.log(data);
  };
  return (
    <Form {...form}>
      <form
        className="flex w-full flex-col gap-10"
        onSubmit={form.handleSubmit(handleCreateQuestion)}
      >
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem className="flex w-full flex-col">
              <FormLabel className="paragraph-semibold text-dark400_light800">
                Question Title <span className="text-primary-500">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  className="paragraph-regular background-light700_dark300 light-border-2 text-dark300_light700 no-focus min-h-[56px]  border"
                  {...field}
                />
              </FormControl>
              <FormDescription className="body-regular text-light-500 mt-2.5">
                Be specific and imagine you’re asking a question to another
                person
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem className="flex w-full flex-col">
              <FormLabel className="paragraph-semibold text-dark400_light800">
                Detailed explanation of your problem <span className="text-primary-500">*</span>
              </FormLabel>
              <FormControl>
                <Editor value={field.value} editorRef={editorRef} fieldChange={field.onchange} />
                 
              </FormControl>
              <FormDescription className="body-regular text-light-500 mt-2.5">
                Introduce the problem and expand on what you’ve put in the title.

              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />{" "}
        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem className="flex w-full flex-col gap-3">
              <FormLabel className="paragraph-semibold text-dark400_light800">
               Tags <span className="text-primary-500">*</span>
              </FormLabel>
              <FormControl>

                <div>
                <Input
                  className="paragraph-regular background-light700_dark300 light-border-2 text-dark300_light700 no-focus min-h-[56px]  border"
                  {...field}
                  placeholder="Add tags..."
                />

                Tags

                </div>
               
              </FormControl>
              <FormDescription className="body-regular text-light-500 mt-2.5">
                Add up to 3 tags to describe what your question is about. You need to press Enter to add a tag.

              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />


          <div className="mt-16 flex justify-end">
            <Button className="primary-gradient !text-light-900 w-fit">
              Ask A Question

            </Button>
          </div>
      </form>
    </Form>
  );
};

export default QuestionForm;
