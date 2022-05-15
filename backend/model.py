import cv2
import numpy as np
from utils.get_predictions import get_predictions
from utils.symbols import special_symbols


class Model():
    def __init__(self, formula):
        self.formula = formula
        self.bounding_boxes = []
        self.symbol_images = []

    def get_bounding_boxes(self):
        _, thresh = cv2.threshold(
            self.formula, 0, 255, cv2.THRESH_BINARY_INV + cv2.THRESH_OTSU
        )

        contours, hierarchy = cv2.findContours(
            thresh, cv2.RETR_TREE, cv2.CHAIN_APPROX_SIMPLE
        )

        if not contours:
            return

        bounding_boxes = []
        for cnt in contours:
            x, y, w, h = cv2.boundingRect(cnt)

            bounding_boxes.append(
                {"xmin": x, "xmax": x + w, "ymin": y,
                    "ymax": y + h}
            )

        hierarchy = hierarchy[0]

        for (bb, i, h) in zip(bounding_boxes, range(0, len(bounding_boxes)), hierarchy):
            if bb["ymax"] - bb["ymin"] < 10 and bb["xmax"] - bb["xmin"] < 10:
                continue
            blank_image = np.full(
                (bb["ymax"] - bb["ymin"], bb["xmax"] -
                 bb["xmin"], 1), 255, np.uint8
            )
            if h[2] < 0 and h[3] < 0:
                blank_image = cv2.drawContours(
                    blank_image,
                    contours,
                    i,
                    (0, 0, 0),
                    cv2.FILLED,
                    offset=(-bb["xmin"], -bb["ymin"]),
                )
                self.bounding_boxes.append(
                    {
                        "xmin": bb["xmin"],
                        "xmax": bb["xmax"],
                        "ymin": bb["ymin"],
                        "ymax": bb["ymax"],
                        "img": blank_image,
                    }
                )
            elif h[3] < 0 and h[2] >= 0:
                blank_image = cv2.drawContours(
                    blank_image,
                    contours,
                    i,
                    (0, 0, 0),
                    cv2.FILLED,
                    offset=(-bb["xmin"], -bb["ymin"]),
                )

                blank_image = cv2.drawContours(
                    blank_image,
                    contours,
                    h[2],
                    (255, 255, 255),
                    cv2.FILLED,
                    offset=(-bb["xmin"], -bb["ymin"]),
                )

                h_child = hierarchy[h[2]]
                while h_child[0] >= 0:
                    blank_image = cv2.drawContours(
                        blank_image,
                        contours,
                        h_child[0],
                        (255, 255, 255),
                        cv2.FILLED,
                        offset=(-bb["xmin"], -bb["ymin"]),
                    )
                    h_child = hierarchy[h_child[0]]

                self.bounding_boxes.append(
                    {
                        "xmin": bb["xmin"],
                        "xmax": bb["xmax"],
                        "ymin": bb["ymin"],
                        "ymax": bb["ymax"],
                        "img": blank_image,
                    }
                )

    def normalize(self):
        for bb in self.bounding_boxes:
            symbol = bb['img'].copy()
            rows, cols, _ = symbol.shape
            inner_size = 42

            if rows > cols:
                factor = inner_size / rows
                rows = inner_size
                cols = int(round(cols * factor))
                cols = cols if cols > 2 else 2
                inner = cv2.resize(symbol, (cols, rows))
            else:
                factor = inner_size / cols
                cols = inner_size
                rows = int(round(rows * factor))
                rows = rows if rows > 2 else 2
                inner = cv2.resize(symbol, (cols, rows))

            outer_size = 45
            colsPadding = (
                int(np.ceil((outer_size - cols) / 2)),
                int(np.floor((outer_size - cols) / 2)),
            )
            rowsPadding = (
                int(np.ceil((outer_size - rows) / 2)),
                int(np.floor((outer_size - rows) / 2)),
            )
            padded = np.pad(
                inner, (rowsPadding, colsPadding), "constant", constant_values=(255, 255)
            )
            thinned = 255 - cv2.ximgproc.thinning(255 - padded)
            normalized = thinned / 255

            self.symbol_images.append(normalized)

    def predict(self):
        self.get_bounding_boxes()

        if(len(self.bounding_boxes) == 0):
            return 'Failed to recognize any symbol'

        self.normalize()

        bounding_boxes = []
        symbol_images = self.symbol_images

        symbols = get_predictions(symbol_images)
        for sym, pos, in zip(
            symbols,
            self.bounding_boxes,
        ):
            bounding_boxes.append(
                {
                    "xmin": pos["xmin"],
                    "xmax": pos["xmax"],
                    "ymin": pos["ymin"],
                    "ymax": pos["ymax"],
                    "symbol": sym,
                    "id": -1,
                    "done": False,
                }
            )
        bounding_boxes = sorted(
            bounding_boxes, key=lambda k: (k["xmin"], k["ymin"])
        )

        left = []
        right = []
        divided = False
        i = 0

        while i < len(bounding_boxes):
            if i == 0:
                left.append(bounding_boxes[i])
                i += 1
                continue
            if divided:
                right.append(bounding_boxes[i])
                i += 1
                continue
            prev = bounding_boxes[i - 1]
            cur = bounding_boxes[i]
            if cur["symbol"] == "-" and prev["symbol"] == "-":
                x_boundary = max(prev["xmax"], cur["xmax"])
                if i == len(bounding_boxes) - 1:
                    divided = True
                    left.pop(len(left) - 1)
                else:
                    next = bounding_boxes[i + 1]
                    if next["xmin"] < x_boundary:
                        left.append(bounding_boxes[i])
                    else:
                        divided = True
                        left.pop(len(left) - 1)
                i += 1
            else:
                left.append(bounding_boxes[i])
                i += 1

        left_compound = set_superscript(set_square_root(set_fraction(left)))
        right_compound = set_superscript(set_square_root(set_fraction(right)))

        right_hand_side = get_expression(right_compound)
        left_hand_side = get_expression(left_compound)

        if len(right_hand_side) == 0:
            return left_hand_side
        elif len(left_hand_side) == 0:
            return right_hand_side
        else:
            return f"{left_hand_side} = {right_hand_side}"


def set_fraction(expression):
    compound = []
    i = 0

    while i < len(expression):
        cur = expression[i]
        if not cur["done"] and cur["symbol"] == "-":
            j = i
            while True:
                if j == 0:
                    break
                prev = expression[j - 1]
                if prev["done"]:
                    break
                prevX = (prev["xmin"] + prev["xmax"]) / 2
                if cur["xmin"] <= prevX and cur["xmax"] >= prevX:
                    j -= 1
                else:
                    break
            up = []
            up_tmp = []
            down = []
            down_tmp = []
            while j < len(expression):
                if j != i:
                    check = expression[j]
                    checkX = (check["xmin"] + check["xmax"]) / 2
                    checkY = (check["ymin"] + check["ymax"]) / 2
                    if cur["xmin"] <= checkX <= cur["xmax"]:
                        if cur["ymax"] < checkY:
                            down.append(check)
                            down_tmp.append(check.copy())
                        elif cur["ymax"] > checkY and cur["ymin"] > checkY:
                            up.append(check)
                            up_tmp.append(check.copy())
                        else:
                            break

                j += 1
            if len(up) != 0 and len(down) != 0:
                for d in down:
                    d["done"] = True
                for u in up:
                    u["done"] = True
                cur["done"] = True
                up = set_fraction(up_tmp)
                down = set_fraction(down_tmp)
                compound.append(
                    {
                        "type": "fraction",
                        "symbol": "-",
                        "done": False,
                        "xmin": cur["xmin"],
                        "xmax": cur["xmax"],
                        "ymin": cur["ymin"],
                        "ymax": cur["ymax"],
                        "up": up,
                        "down": down,
                        "inner": [],
                    }
                )
        i += 1
    for cur in expression:
        if not cur["done"]:
            compound.append(
                {
                    "type": "normal",
                    "done": False,
                    "symbol": cur["symbol"],
                    "xmin": cur["xmin"],
                    "xmax": cur["xmax"],
                    "ymin": cur["ymin"],
                    "ymax": cur["ymax"],
                    "up": [],
                    "down": [],
                    "inner": [],
                }
            )

    return sorted(compound, key=lambda k: (k["xmin"], k["ymin"]))


def set_square_root(bonding_boxes):
    compound = []
    i = 0
    while i < len(bonding_boxes):
        cur = bonding_boxes[i]
        if cur["done"]:
            i += 1
            continue
        elif cur["type"] == "fraction":
            compound.append(
                {
                    "type": "fraction",
                    "symbol": "-",
                    "xmin": cur["xmin"],
                    "xmax": cur["xmax"],
                    "ymin": cur["ymin"],
                    "ymax": cur["ymax"],
                    "done": False,
                    "up": set_square_root(cur["up"]),
                    "down": set_square_root(cur["down"]),
                    "inner": [],
                }
            )
            i += 1
            continue

        if i == len(bonding_boxes) - 1:
            cur["done"] = True
            compound.append(
                {
                    "type": "normal",
                    "done": False,
                    "symbol": cur["symbol"],
                    "xmin": cur["xmin"],
                    "xmax": cur["xmax"],
                    "ymin": cur["ymin"],
                    "ymax": cur["ymax"],
                    "up": [],
                    "down": [],
                    "inner": [],
                }
            )
            i += 1
            continue

        inner = []

        while i < len(bonding_boxes) - 1:
            next = bonding_boxes[i + 1]
            if next["done"]:
                continue
            nextX = (next["xmin"] + next["xmax"]) / 2
            nextY = (next["ymin"] + next["ymax"]) / 2
            if (
                cur["xmin"] <= nextX <= cur["xmax"]
                and cur["ymin"] <= nextY <= cur["ymax"]
            ):
                inner.append(next.copy())
                next["done"] = True
            else:
                break
            i += 1

        if len(inner) == 0:
            cur["done"] = True
            compound.append(
                {
                    "type": "normal",
                    "done": False,
                    "symbol": cur["symbol"],
                    "xmin": cur["xmin"],
                    "xmax": cur["xmax"],
                    "ymin": cur["ymin"],
                    "ymax": cur["ymax"],
                    "up": [],
                    "down": [],
                    "inner": [],
                }
            )
        else:
            compound.append(
                {
                    "type": "square_root",
                    "symbol": "sqrt",
                    "done": False,
                    "xmin": cur["xmin"],
                    "xmax": cur["xmax"],
                    "ymin": cur["ymin"],
                    "ymax": cur["ymax"],
                    "up": [],
                    "down": [],
                    "inner": set_square_root(inner),
                }
            )
        i += 1
    return compound


def set_superscript(compounds):
    compound = []
    i = 0

    while i < len(compounds):
        cur = compounds[i]
        if cur["done"]:
            i += 1
            continue
        elif cur["type"] == "fraction":
            compound.append(
                {
                    "type": "fraction",
                    "symbol": "-",
                    "xmin": cur["xmin"],
                    "xmax": cur["xmax"],
                    "ymin": cur["ymin"],
                    "ymax": cur["ymax"],
                    "done": False,
                    "up": set_superscript(cur["up"]),
                    "down": set_superscript(cur["down"]),
                    "inner": [],
                }
            )
            i += 1
            continue
        elif cur["type"] == "square_root":
            compound.append(
                {
                    "type": "square_root",
                    "symbol": "sqrt",
                    "xmin": cur["xmin"],
                    "xmax": cur["xmax"],
                    "ymin": cur["ymin"],
                    "ymax": cur["ymax"],
                    "done": False,
                    "up": [],
                    "down": [],
                    "inner": set_superscript(cur["inner"]),
                }
            )
            i += 1
            continue

        up = []
        while i < len(compounds) - 1:
            next = compounds[i + 1]
            if next["done"]:
                continue
            if (
                cur["ymin"] >= next["ymin"]
                and cur["ymin"] + 0.5 * (cur["ymax"] - cur["ymin"]) >= next["ymax"]
            ):
                up.append(next.copy())
                next["done"] = True
            else:
                break
            i += 1

        if len(up) == 0:
            cur["done"] = True
            compound.append(
                {
                    "type": "normal",
                    "symbol": cur["symbol"],
                    "xmin": cur["xmin"],
                    "xmax": cur["xmax"],
                    "ymin": cur["ymin"],
                    "ymax": cur["ymax"],
                    "up": [],
                    "down": [],
                    "inner": [],
                    "done": False,
                }
            )
        else:
            cur["done"] = True
            up = set_superscript(up)
            compound.append(
                {
                    "type": "superscript",
                    "symbol": cur["symbol"],
                    "done": False,
                    "xmin": cur["xmin"],
                    "xmax": cur["xmax"],
                    "ymin": cur["ymin"],
                    "ymax": cur["ymax"],
                    "up": up,
                    "down": [],
                    "inner": [],
                }
            )
        i += 1
    return compound


def combine_expression(compound):
    up = compound["up"]
    down = compound["down"]
    inner = compound["inner"]
    type = compound["type"]
    symbol = compound["symbol"]

    if type == "fraction":
        return "\\frac{" + get_expression(up) + "}{" + get_expression(down) + "}"
    elif type == "square_root":
        return "\sqrt{" + get_expression(inner) + "}"
    elif type == "superscript":
        if len(up) != 0:
            return symbol + "^{" + get_expression(up) + "}"
        return symbol
    elif symbol in special_symbols:
        return "\\" + symbol
    else:
        return symbol


def get_expression(compounds):
    expression = map(combine_expression, compounds)

    return "".join(expression)
