"use client";

interface Props {
  params: {
    nickname: string;
  };
}

export default function CreateRoomPage(props: Readonly<Props>) {
  console.log(props);

  return <div>create room</div>;
}
