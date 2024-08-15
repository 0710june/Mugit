type PaginationProps = {
  totalPage: number;
  apiPage: number;
  setApiPage: React.Dispatch<React.SetStateAction<number>>;
};

function createArray(end: number): number[] {
  return Array.from({ length: end }, (_, index) => index + 1);
}

export default function Pagination({
  totalPage,
  apiPage,
  setApiPage,
}: PaginationProps) {
  const pageArray = createArray(totalPage);

  const handlePageChange = (page: number) => {
    if (page === apiPage + 1) return;
    setApiPage(page - 1);
  };

  const handlePrevious = () => {
    if (apiPage === 0) return;
    setApiPage(apiPage - 1);
  };

  const handleNext = () => {
    console.log(apiPage, totalPage);
    if (apiPage === totalPage - 1) return;
    setApiPage(apiPage + 1);
  };

  return (
    <nav className="mx-auto">
      <ul className="inline-flex -space-x-px text-sm">
        <li onClick={handlePrevious} className="cursor-pointer">
          <div className="ms-0 flex h-8 items-center justify-center rounded-s-lg border border-e-0 border-gray-300 bg-white px-3 leading-tight text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
            Previous
          </div>
        </li>
        {pageArray.map((item) => {
          const IsNowPage = apiPage + 1 === item;
          return (
            <li
              key={item}
              onClick={() => handlePageChange(item)}
              className="cursor-pointer"
            >
              <div
                className={`flex h-8 items-center justify-center rounded-lg 
                ${
                  IsNowPage
                    ? "border border-gray-500 bg-gray-200 px-3 leading-tight text-gray-500   "
                    : "border border-gray-300 bg-white px-3 leading-tight text-gray-500 hover:bg-gray-100 hover:text-gray-700 "
                }`}
              >
                {item}
              </div>
            </li>
          );
        })}

        <li onClick={handleNext} className="cursor-pointer">
          <div className="flex h-8 items-center justify-center rounded-e-lg border border-gray-300 bg-white px-3 leading-tight text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
            Next
          </div>
        </li>
      </ul>
    </nav>
  );
}
