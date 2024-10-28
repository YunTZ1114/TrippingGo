import React, { useEffect, useRef, useState } from "react";
import { FavoriteRate } from "./FavoriteRate";
import { Avatar, Slider } from "antd";
import "./../../styles.css";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/api";
import { Loading, TextArea } from "@/components";
import { PlaceComment } from "@/api/trips";
import { useTripContext } from "../../../contexts";

interface CommentProps extends PlaceComment {
  onChange: ({ comment, rating }: { comment: string; rating: number }) => void;
}

const Comment = ({ onChange, ...placeComment }: CommentProps) => {
  const { tripMembers } = useTripContext();

  const getTripMember = (tripMemberId: number) => {
    return tripMembers.find((member) => member.id === tripMemberId);
  };

  const tripMember = getTripMember(placeComment.tripMemberId);
  const { avatar, nickname } = tripMember || {
    avatar: null,
    nickname: "Unknown",
  };

  const [showSlider, setShowSlider] = useState(false);
  const [rating, setRating] = useState(placeComment.rating ?? 0);
  const [comment, setComment] = useState(placeComment.comment ?? "");
  const isEditing = useRef(false);

  const initialComment = useRef(placeComment.comment ?? "");
  const initialRating = useRef(placeComment.rating ?? 0);

  const handleChange = () => {
    if (
      comment !== initialComment.current ||
      rating !== initialRating.current
    ) {
      onChange({ rating, comment });
      initialComment.current = comment;
      initialRating.current = rating;
      isEditing.current = false;
      setShowSlider(false);
    }
  };

  useEffect(() => {
    if (!isEditing.current) return;
    document.addEventListener("mouseup", handleChange);
    return () => {
      document.removeEventListener("mouseup", handleChange);
    };
  }, [rating, comment]);

  return (
    <div className="mb-4 flex items-center">
      <Avatar
        className="mr-3 border border-[#AE9A9A]"
        size={24}
        icon={nickname[0].toUpperCase()}
        src={avatar}
      />

      <div className="flex w-full items-center justify-between">
        <span className="w-full pr-3 text-xs text-gray-600">
          {placeComment.isOwner ? (
            <TextArea
              className="text-gray-600"
              size="small"
              placeholder="留言..."
              value={comment}
              onChange={(e) => {
                setComment(e.target.value);
              }}
              onBlur={handleChange}
              autoSize={{ minRows: 1, maxRows: 5 }}
            />
          ) : (
            placeComment.comment
          )}
        </span>
        {showSlider && placeComment.isOwner ? (
          <div
            className="flex items-center gap-2"
            onMouseLeave={() => !isEditing.current && setShowSlider(false)}
          >
            <Slider
              className="my-0 w-12"
              min={1}
              max={5}
              step={1}
              defaultValue={rating}
              onChange={setRating}
              styles={{ track: { backgroundColor: "#E77F6C" } }}
              onFocus={() => {
                isEditing.current = true;
              }}
              onBlur={handleChange}
            />
            <div className="mr-1 text-[12px] text-primary">{rating}</div>
          </div>
        ) : (
          <div
            onMouseEnter={() => {
              setShowSlider(true);
            }}
          >
            <FavoriteRate iconSize={16} rating={placeComment.rating} />
          </div>
        )}
      </div>
    </div>
  );
};

export const CommentList = ({
  tripId,
  placeId,
}: {
  tripId: number;
  placeId: number;
}) => {
  const pathParams = { tripId, placeId };
  const { data: placeComments, isLoading } = useQuery({
    queryKey: api.trips.keys.placeComment(tripId, placeId),
    queryFn: async () => await api.trips.getPlaceComments({ pathParams }),
  });

  const queryClient = useQueryClient();
  const putPlaceCommentAction = useMutation({
    mutationFn: api.trips.putPlaceComments,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: api.trips.keys.placeComment(tripId, placeId),
      });
    },
  });

  return (
    <div className="comment-list">
      {isLoading ? (
        <Loading />
      ) : (
        placeComments
          ?.sort((_, b) => (b.isOwner ? 1 : -1))
          .map((item) => {
            return (
              <Comment
                key={item.id}
                {...item}
                rating={item.rating}
                onChange={(value) =>
                  putPlaceCommentAction.mutate({
                    pathParams: { ...pathParams, placeCommentId: item.id },
                    data: {
                      rating: value.rating,
                      comment: value.comment,
                    },
                  })
                }
              />
            );
          })
      )}
    </div>
  );
};
