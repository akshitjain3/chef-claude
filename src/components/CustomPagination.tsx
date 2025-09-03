import "./CustomPagination.css";
import rightArrow from "../assets/svg/right-arrow.svg";

interface Props {
  currentPage: number;
  totalPages: number;
  maxVisiblePages?: number;
  onPageChange: (page: number) => void;
}

const CustomPagination = ({
  currentPage,
  totalPages,
  maxVisiblePages = 3,
  onPageChange,
}: Props) => {
  const getPages = () => {
    const pages: number[] = [];
    let start = Math.max(currentPage - 1, 1);
    let end = start + maxVisiblePages - 1;

    if (end > totalPages) {
      end = totalPages;
      start = Math.max(end - maxVisiblePages + 1, 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  };

  return (
    <div className="custom-pagination">
      <button
        className="pagination-btn"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        <img
          className="svg-img img-left"
          src={rightArrow}
          alt="Previous"
          aria-label="Previous"
        />
      </button>

      {getPages().map((page, i) => (
        <button
          key={i}
          className={`pagination-btn ${page === currentPage ? "active" : ""}`}
          onClick={() => onPageChange(Number(page))}
        >
          {page}
        </button>
      ))}

      <button
        className="pagination-btn"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        <img
          className="svg-img"
          src={rightArrow}
          alt="Previous"
          aria-label="Previous"
        />
      </button>
    </div>
  );
};

export default CustomPagination;
