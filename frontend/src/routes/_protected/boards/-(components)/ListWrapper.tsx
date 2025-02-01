const ListWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <li className="h-full w-[272px] shrink-0 select-none">{children}</li>;
};
export default ListWrapper;
