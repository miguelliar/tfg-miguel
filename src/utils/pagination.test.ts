import { generatePagination } from "./pagination" // Adjust path as needed

describe("generatePagination Utility", () => {
  describe("When totalPages is 7 or less", () => {
    test("Then it should return all page numbers from 1 to totalPages", () => {
      expect(generatePagination(1, 1)).toEqual([1])
      expect(generatePagination(3, 5)).toEqual([1, 2, 3, 4, 5])
      expect(generatePagination(7, 7)).toEqual([1, 2, 3, 4, 5, 6, 7])
      expect(generatePagination(1, 0)).toEqual([])
    })

    test("Then it should handle totalPages = 6", () => {
      expect(generatePagination(4, 6)).toEqual([1, 2, 3, 4, 5, 6])
    })
  })

  describe("When totalPages is greater than 7", () => {
    describe("And currentPage is among the first 3 pages (currentPage <= 3)", () => {
      const totalPages = 10
      test("Then it should show the first 3, an ellipsis, and the last 2 pages (e.g., currentPage = 1)", () => {
        expect(generatePagination(1, totalPages)).toEqual([
          1,
          2,
          3,
          "...",
          9,
          10,
        ])
      })
      test("Then it should show the first 3, an ellipsis, and the last 2 pages (e.g., currentPage = 2)", () => {
        expect(generatePagination(2, totalPages)).toEqual([
          1,
          2,
          3,
          "...",
          9,
          10,
        ])
      })
      test("Then it should show the first 3, an ellipsis, and the last 2 pages (e.g., currentPage = 3)", () => {
        expect(generatePagination(3, totalPages)).toEqual([
          1,
          2,
          3,
          "...",
          9,
          10,
        ])
      })

      // Test with totalPages = 8 (just above 7)
      test("Then it should work correctly for totalPages = 8, currentPage = 1", () => {
        expect(generatePagination(1, 8)).toEqual([1, 2, 3, "...", 7, 8])
      })
      test("Then it should work correctly for totalPages = 8, currentPage = 3", () => {
        expect(generatePagination(3, 8)).toEqual([1, 2, 3, "...", 7, 8])
      })
    })

    describe("And currentPage is among the last 3 pages (currentPage >= totalPages - 2)", () => {
      const totalPages = 10
      test("Then it should show the first 2, an ellipsis, and the last 3 pages (e.g., currentPage = 10)", () => {
        expect(generatePagination(10, totalPages)).toEqual([
          1,
          2,
          "...",
          8,
          9,
          10,
        ])
      })
      test("Then it should show the first 2, an ellipsis, and the last 3 pages (e.g., currentPage = 9)", () => {
        expect(generatePagination(9, totalPages)).toEqual([
          1,
          2,
          "...",
          8,
          9,
          10,
        ])
      })
      test("Then it should show the first 2, an ellipsis, and the last 3 pages (e.g., currentPage = 8)", () => {
        expect(generatePagination(8, totalPages)).toEqual([
          1,
          2,
          "...",
          8,
          9,
          10,
        ])
      })

      // Test with totalPages = 8 (just above 7)
      // totalPages - 2 = 6
      test("Then it should work correctly for totalPages = 8, currentPage = 6 (totalPages - 2)", () => {
        expect(generatePagination(6, 8)).toEqual([1, 2, "...", 6, 7, 8])
      })
      test("Then it should work correctly for totalPages = 8, currentPage = 7 (totalPages - 1)", () => {
        expect(generatePagination(7, 8)).toEqual([1, 2, "...", 6, 7, 8])
      })
      test("Then it should work correctly for totalPages = 8, currentPage = 8 (totalPages)", () => {
        expect(generatePagination(8, 8)).toEqual([1, 2, "...", 6, 7, 8])
      })
    })

    describe("And currentPage is in the middle", () => {
      const totalPages = 10
      test("Then it should show first, ellipsis, current & neighbors, ellipsis, last (e.g., currentPage = 4)", () => {
        // For totalPages=10: currentPage=4 is not <=3 and not >=8
        expect(generatePagination(4, totalPages)).toEqual([
          1,
          "...",
          3,
          4,
          5,
          "...",
          10,
        ])
      })
      test("Then it should show first, ellipsis, current & neighbors, ellipsis, last (e.g., currentPage = 5)", () => {
        expect(generatePagination(5, totalPages)).toEqual([
          1,
          "...",
          4,
          5,
          6,
          "...",
          10,
        ])
      })
      test("Then it should show first, ellipsis, current & neighbors, ellipsis, last (e.g., currentPage = 6)", () => {
        expect(generatePagination(6, totalPages)).toEqual([
          1,
          "...",
          5,
          6,
          7,
          "...",
          10,
        ])
      })
      test("Then it should show first, ellipsis, current & neighbors, ellipsis, last (e.g., currentPage = 7)", () => {
        // For totalPages=10: currentPage=7 is not <=3 and not >=8
        expect(generatePagination(7, totalPages)).toEqual([
          1,
          "...",
          6,
          7,
          8,
          "...",
          10,
        ])
      })

      // Test with totalPages = 8 (just above 7)
      // Middle pages are 4, 5
      // currentPage = 4: (4 <= 3 is F; 4 >= 8-2=6 is F) -> Middle
      test("Then it should work correctly for totalPages = 8, currentPage = 4", () => {
        expect(generatePagination(4, 8)).toEqual([1, "...", 3, 4, 5, "...", 8])
      })
      // currentPage = 5: (5 <= 3 is F; 5 >= 6 is F) -> Middle
      test("Then it should work correctly for totalPages = 8, currentPage = 5", () => {
        expect(generatePagination(5, 8)).toEqual([1, "...", 4, 5, 6, "...", 8])
      })

      // Test with a larger number of pages
      const largeTotalPages = 20
      test("Then it should work for large totalPages, currentPage near beginning but middle (e.g., currentPage = 4)", () => {
        // For totalPages=20: currentPage=4 is not <=3 and not >=18
        expect(generatePagination(4, largeTotalPages)).toEqual([
          1,
          "...",
          3,
          4,
          5,
          "...",
          20,
        ])
      })
      test("Then it should work for large totalPages, currentPage in deep middle (e.g., currentPage = 10)", () => {
        expect(generatePagination(10, largeTotalPages)).toEqual([
          1,
          "...",
          9,
          10,
          11,
          "...",
          20,
        ])
      })
      test("Then it should work for large totalPages, currentPage near end but middle (e.g., currentPage = 17)", () => {
        // For totalPages=20: currentPage=17 is not <=3 and not >=18
        expect(generatePagination(17, largeTotalPages)).toEqual([
          1,
          "...",
          16,
          17,
          18,
          "...",
          20,
        ])
      })
    })
  })

  // Optional: Test cases with currentPage potentially out of logical bounds,
  // just to document behavior, though the function assumes valid currentPage.
  describe("With potentially out-of-bounds currentPage (documenting behavior)", () => {
    test("When currentPage is 0 or less with totalPages > 7", () => {
      // Falls into `currentPage <= 3`
      expect(generatePagination(0, 10)).toEqual([1, 2, 3, "...", 9, 10])
      expect(generatePagination(-1, 10)).toEqual([1, 2, 3, "...", 9, 10])
    })
    test("When currentPage is greater than totalPages with totalPages > 7", () => {
      // Falls into `currentPage >= totalPages - 2`
      expect(generatePagination(11, 10)).toEqual([1, 2, "...", 8, 9, 10])
      expect(generatePagination(100, 10)).toEqual([1, 2, "...", 8, 9, 10])
    })
    test("When currentPage is 0 or less with totalPages <= 7", () => {
      // Falls into `totalPages <= 7`
      expect(generatePagination(0, 5)).toEqual([1, 2, 3, 4, 5])
    })
    test("When currentPage is greater than totalPages with totalPages <= 7", () => {
      // Falls into `totalPages <= 7`
      expect(generatePagination(10, 5)).toEqual([1, 2, 3, 4, 5])
    })
  })
})
