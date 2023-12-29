const Sidebar = () => {
  const items = Array.from({ length: 10 }).map(() => 'HELLO');
  return (
    <aside className="h-full w-52">
      <div className="pt-4">
        <h1>Sidebar</h1>
        <ul className="mt-4 space-y-3">
          {items.map((i) => (
            <div>{i}</div>
          ))}
        </ul>
      </div>
    </aside>
  );
};

export default Sidebar;
