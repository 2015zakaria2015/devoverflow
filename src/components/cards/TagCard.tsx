import React from "react";
import Link from "next/link";
import ROUTES from "@/constants/routes";
import { getDeviconsClassName } from "@/src/lib/utils";
import Image from "next/image";
import { Badge } from "../ui/badge";

interface Props {
  _id: string;
  name: string;
  questions?: number;
  showCount?: boolean;
  compact?: boolean;
  remove?: boolean;
  isButton?: boolean;
  handleRemove?: () => void;
}

const TagCard = ({
  _id,
  name,
  questions,
  showCount,
  compact,
  remove,
  isButton,
  handleRemove,
}: Props) => {
  const iconClass = getDeviconsClassName(name);

  const handleClick = (e:React.MouseEvent) => {
    e.preventDefault();
  }

  const content = (
    <>
      <Badge className="background-light800_dark300 text-light400_light500 rounded-md border-none px-4 py-2 uppercase flex flex-row gap-2">
        <div className="flex-center space-x-2">
          <i className={`${iconClass} text-sm`}></i>
          <span>{name}</span>
        </div>
        {remove && (
          <Image
            src="/icons/close.svg"
            alt="close"
            width={12}
            height={12}
            className="cursor-pointer invert-0 dark:invert"
            onClick={handleRemove}
          />
        )}
      </Badge>
      {showCount && (
        <p className="small-medium text-dark500_light700">{questions}</p>
      )}
    </>
  );

  if (compact) {
    return isButton ? (
      <button onClick={handleClick} className="flex justify-between gap-2">
        {content}
      </button>
    ) : (
      <Link href={ROUTES.TAGS(_id)} className="flex justify-between gap-2">
        {content}
      </Link>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {content}
    </div>
  );
};

export default TagCard;
