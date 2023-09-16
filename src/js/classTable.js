import Mustache from "mustache";

export default class Table {
  constructor(element, data) {
    this.element = element;
    this.data = data;
  }

  renderHeader() {
    this.element.innerHTML = `<table>
        <tbody>
            <tr>
                <th><p>id</p></th>
                <th><p>title</p></th>
                <th><p>year</p></th>
                <th><p>imdb</p></th>
            </tr>
        </tbody>
    </table>`;
    console.log(this.data);
  }

  setData(data = this.data) {
    const template = `<tr class= "item">
    <td>{{ id }}</td>
    <td>{{ title }}</td>
    <td>{{ year }}</td>
    <td>{{ imdb }}</td>
    </tr>
`;
    let innerHtml = "";
    for (const item of data) {
      const render = Mustache.render(template, {
        id: item.id,
        title: item.title,
        year: item.year,
        imdb: Number(item.imdb).toFixed(2),
      });
      innerHtml += render;
    }

    this.element
      .querySelector("tbody")
      .insertAdjacentHTML("beforeend", innerHtml);
  }

  sortData(sortingBy) {
    if (!isNaN(this.data[0][sortingBy])) {
      this.data.sort((a, b) => a[sortingBy] - b[sortingBy]);
    } else {
      const collator = new Intl.Collator();
      this.data.sort((a, b) => {
        return collator.compare(a[sortingBy], b[sortingBy]);
      });
    }
    return this.data;
  }

  deleteData() {
    const items = Array.from(this.element.querySelectorAll(".item"));
    items.forEach((el) => el.remove());
  }

  sorting() {
    const sortingBy = [];
    const keys = Array.from(this.element.querySelectorAll("th > p"));
    for (let key of keys) {
      sortingBy.push(key.textContent);
    }
    let i = 0;
    let max = sortingBy.length;
    setInterval(() => {
      if (i !== max && i % 1 === 0) {
        const data = this.sortData(sortingBy[i]);
        this.deleteData();
        this.setData(data);
        this.addArrowDown(sortingBy[i]);
        i += 0.5;
      } else if (i !== max && i % 1 !== 0) {
        const data = this.sortData(sortingBy[i]);
        this.deleteData();
        this.setData(data.reverse());
        this.addArrowUp();
        i += 0.5;
      } else if (i === max) {
        i = 0;
      }
    }, 2000);
  }

  addArrowDown(header) {
    const a = this.element.querySelector(".arrow-up");
    if (a) {
      a.classList.remove("arrow-up");
    }
    const array = Array.from(this.element.querySelectorAll("th > p"));
    array.find((el) => el.textContent === header).classList.add("arrow-down");
  }

  addArrowUp() {
    const a = this.element.querySelector(".arrow-down");
    a.classList.remove("arrow-down");
    a.classList.add("arrow-up");
  }
}
