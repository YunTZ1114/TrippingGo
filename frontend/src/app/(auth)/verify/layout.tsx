const VerifyLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <div className="hide-scrollbar flex h-full w-full justify-center overflow-auto p-[50px]">
      <div className="flex h-max w-[500px] flex-col items-center justify-center gap-10 rounded-2xl bg-white p-[50px] shadow-lg">
        {children}
      </div>
    </div>
  );
};

export default VerifyLayout;
