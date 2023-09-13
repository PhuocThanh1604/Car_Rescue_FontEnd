import axios from "axios";

export class ProductDataService {
  getAll() {
    return axios.get("https://secondhandbookstoreapi.azurewebsites.net/api/Books/GetList");
  }

  get(id) {
    return axios.get(`https://secondhandbookstoreapi.azurewebsites.net/api/Books/GetBook/${id}`);
  }

  create(product) {
    return axios.post("https://secondhandbookstoreapi.azurewebsites.net/api/Books/Create", product);
  }

  update(id, product) {
    return axios.put(`https://secondhandbookstoreapi.azurewebsites.net/api/Books/update/${id}`, product);
  }

  delete(id) {
    return axios.delete(`https://secondhandbookstoreapi.azurewebsites.net/api/Books/Delete/${id}`);
  }

  deleteAll() {
    return axios.delete("https://secondhandbookstoreapi.azurewebsites.net/api/Books/Delete");
  }

  findByName(bookname) {
    return axios.get(`https://secondhandbookstoreapi.azurewebsites.net/api/Books/SearchByBook?name=${bookname}`);
  }

  findByAuthorName(authorname) {
    return axios.get(`https://secondhandbookstoreapi.azurewebsites.net/api/Books/SearchByAuthor?author=${authorname}`);
  }
}
