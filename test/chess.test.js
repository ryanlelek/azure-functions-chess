// Subject Under Test
const sut = require("../src/lib/chess.js");

describe("chess.js", () => {
  let move_map = {};
  beforeAll(() => {
    // Pre-compute Move Map
    // It will usually be accessible in storage
    move_map = sut.generate_move_map();
  });

  describe("ltr_to_int()", () => {
    it("should return correct letter index", () => {
      expect(sut.ltr_to_int("A")).toEqual(1);
      expect(sut.ltr_to_int("B")).toEqual(2);
      expect(sut.ltr_to_int("C")).toEqual(3);
      expect(sut.ltr_to_int("D")).toEqual(4);
      expect(sut.ltr_to_int("E")).toEqual(5);
      expect(sut.ltr_to_int("F")).toEqual(6);
      expect(sut.ltr_to_int("G")).toEqual(7);
      expect(sut.ltr_to_int("H")).toEqual(8);
    });
    it("should return -1 when invalid letter", () => {
      expect(sut.ltr_to_int("I")).toEqual(-1);
      expect(sut.ltr_to_int("X")).toEqual(-1);
      expect(sut.ltr_to_int("Z")).toEqual(-1);
    });
  });

  describe("valid_notation()", () => {
    it("should return true for valid notations", () => {
      expect(sut.valid_notation("C1")).toEqual(true);
      expect(sut.valid_notation("A4")).toEqual(true);
      expect(sut.valid_notation("H8")).toEqual(true);
      expect(sut.valid_notation("E2")).toEqual(true);
    });
    it("should return false for invalid notations", () => {
      expect(sut.valid_notation("11")).toEqual(false);
      expect(sut.valid_notation(11)).toEqual(false);
      expect(sut.valid_notation("A9")).toEqual(false);
      expect(sut.valid_notation("B11")).toEqual(false);
      expect(sut.valid_notation("C0")).toEqual(false);
      expect(sut.valid_notation("CC")).toEqual(false);
      expect(sut.valid_notation("11")).toEqual(false);
      expect(sut.valid_notation("EE1")).toEqual(false);
    });
  });

  describe("valid_coords()", () => {
    it("should return false when x less than 1", () => {
      expect(sut.valid_coords(0, 5)).toEqual(false);
      expect(sut.valid_coords(-20, 3)).toEqual(false);
    });
    it("should return false when x greater than 8", () => {
      expect(sut.valid_coords(9, 5)).toEqual(false);
      expect(sut.valid_coords(102, 3)).toEqual(false);
    });
    it("should return false when y less than 1", () => {
      expect(sut.valid_coords(4, 0)).toEqual(false);
      expect(sut.valid_coords(2, -22)).toEqual(false);
    });
    it("should return false when y greater than 8", () => {
      expect(sut.valid_coords(4, 9)).toEqual(false);
      expect(sut.valid_coords(2, 1002)).toEqual(false);
    });
    it("should return true when x and y are between 1 and 8", () => {
      expect(sut.valid_coords(3, 8)).toEqual(true);
      expect(sut.valid_coords(1, 3)).toEqual(true);
    });
  });

  describe("valid_uuid()", () => {
    it("should return true with valid uuid v4", () => {
      expect(sut.valid_uuid("d82f2ea5-50e6-492f-b20a-6285bd04fbf0")).toEqual(
        true,
      );
      expect(sut.valid_uuid("d3fcaaf3-834a-4384-9339-1d77c0bcd31b")).toEqual(
        true,
      );
    });
  });

  describe("notation_to_coords()", () => {
    it("should return correct integers", () => {
      expect(sut.notation_to_coords("A1")).toEqual([1, 1]);
      expect(sut.notation_to_coords("H8")).toEqual([8, 8]);
      expect(sut.notation_to_coords("C7")).toEqual([3, 7]);
    });
  });

  describe("coords_to_notation()", () => {
    it("should return correct integers", () => {
      expect(sut.coords_to_notation(1, 1)).toEqual("A1");
      expect(sut.coords_to_notation(8, 8)).toEqual("H8");
      expect(sut.coords_to_notation(3, 7)).toEqual("C7");
    });
  });

  describe("moves_available()", () => {
    it("should return valid placements", () => {
      expect(sut.moves_available("A1")).toEqual(["B3", "C2"]);
      expect(sut.moves_available("C5")).toEqual([
        "D7",
        "B7",
        "A6",
        "A4",
        "D3",
        "B3",
        "E6",
        "E4",
      ]);
      expect(sut.moves_available("H8")).toEqual(["F7", "G6"]);
    });
  });

  describe("moves_available()", () => {
    it("should return valid placements", () => {
      expect(sut.moves_available("A1")).toEqual(["B3", "C2"]);
      expect(sut.moves_available("C5")).toEqual([
        "D7",
        "B7",
        "A6",
        "A4",
        "D3",
        "B3",
        "E6",
        "E4",
      ]);
      expect(sut.moves_available("H8")).toEqual(["F7", "G6"]);
    });
  });

  describe("generate_move_map()", () => {
    it("should have 2 options for A1", () => {
      expect(move_map["A1"]).toHaveLength(2);
      expect(move_map["A1"]).toEqual(["B3", "C2"]);
    });
    it("should have 8 options for F3", () => {
      expect(move_map["F3"]).toHaveLength(8);
      expect(move_map["F3"]).toEqual([
        "G5",
        "E5",
        "D4",
        "D2",
        "G1",
        "E1",
        "H4",
        "H2",
      ]);
    });
  });

  describe("find_valid_paths()", () => {
    it("should meet the provided specification for C1 => F7", () => {
      const result = sut.find_valid_paths(move_map, "C1", "F7");
      expect(result).toHaveLength(1);
      expect(result[0]).toEqual(["C1", "D3", "E5", "F7"]);
    });
    it("should meet the provided specification for A1 => D5", () => {
      const result = sut.find_valid_paths(move_map, "A1", "D5");
      expect(result).toHaveLength(2);
      expect(result[0]).toEqual(["A1", "C2", "B4", "D5"]);
      expect(result[1]).toEqual(["A1", "C2", "E3", "D5"]);
    });
  });
});
