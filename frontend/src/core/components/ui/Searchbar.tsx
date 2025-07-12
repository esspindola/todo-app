import { useState } from "react";
import styles from "../../styles/Searchbar.module.scss";
import Button from "./Button";

interface SearchbarProps {
  searchTerm: string;
  onSearchKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClearSearch: () => void;
  onFilterChange: (filters: FilterState) => void;
  filters: FilterState;
}

export interface FilterState {
  done?: boolean | null;
  created_at_after?: string;
  created_at_before?: string;
}

export default function Searchbar({
  searchTerm,
  onSearchKeyDown,
  onSearchChange,
  onClearSearch,
  onFilterChange,
  filters,
}: SearchbarProps) {
  const [showFilters, setShowFilters] = useState(false);

  const handleStatusFilter = (status: boolean | null) => {
    onFilterChange({ ...filters, done: status });
  };

  const handleDateFilter = (
    field: "created_at_after" | "created_at_before",
    value: string
  ) => {
    onFilterChange({ ...filters, [field]: value });
  };

  const clearFilters = () => {
    onFilterChange({});
    onClearSearch();
  };

  return (
    <div className={styles.SearchbarWrapper}>
      <div className={styles.SearchContainer}>
        <input
          className={styles.SearchInput}
          type="text"
          placeholder="Search tasks... (press Enter to search)"
          value={searchTerm}
          onChange={onSearchChange}
          onKeyDown={onSearchKeyDown}
        />
        {searchTerm && (
          <button
            onClick={onClearSearch}
            style={{
              background: "none",
              border: "none",
              fontSize: "1.5rem",
              cursor: "pointer",
              color: "#888",
              marginLeft: 4,
            }}
            tabIndex={0}
            aria-label="Limpiar búsqueda"
          >
            &times;
          </button>
        )}
        <Button
          className={styles.FilterButton}
          onClick={() => setShowFilters(!showFilters)}
        >
          Filters
        </Button>
      </div>

      {showFilters && (
        <div className={styles.FiltersPanel}>
          <div className={styles.FilterGroup}>
            <label className={styles.FilterLabel}>Status</label>
            <div className={styles.FilterButtons}>
              <button
                className={`${styles.FilterBtn} ${
                  filters.done === null ? styles.Active : ""
                }`}
                onClick={() => handleStatusFilter(null)}
              >
                All
              </button>
              <button
                className={`${styles.FilterBtn} ${
                  filters.done === false ? styles.Active : ""
                }`}
                onClick={() => handleStatusFilter(false)}
              >
                In Progress
              </button>
              <button
                className={`${styles.FilterBtn} ${
                  filters.done === true ? styles.Active : ""
                }`}
                onClick={() => handleStatusFilter(true)}
              >
                Completed
              </button>
            </div>
          </div>

          <div className={styles.FilterGroup}>
            <label className={styles.FilterLabel}>Date Range</label>
            <div className={styles.DateInputs}>
              <input
                type="date"
                className={styles.DateInput}
                value={filters.created_at_after || ""}
                onChange={(e) =>
                  handleDateFilter("created_at_after", e.target.value)
                }
                placeholder="From"
              />
              <input
                type="date"
                className={styles.DateInput}
                value={filters.created_at_before || ""}
                onChange={(e) =>
                  handleDateFilter("created_at_before", e.target.value)
                }
                placeholder="To"
              />
            </div>
          </div>

          <Button className={styles.ClearFilters} onClick={clearFilters}>
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  );
}
