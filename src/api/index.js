const BASE_URL = 'http://localhost:3000/api';

const HTTP_METHOD = {
  POST(data) {
    return {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    };
  },
  PUT(data) {
    return {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: data ? JSON.stringify(data) : null,
    };
  },
  DELETE() {
    return {
      method: 'DELETE',
    };
  },
};

const request = async (url, option) => {
  const res = await fetch(url, option);
  if (!res.ok) {
    alert('에러가 발생했습니다.');
  }
  return res.json();
};

const requestWithOutJSON = async (url, option) => {
  const res = await fetch(url, option);
  if (!res.ok) {
    alert('에러가 발생했습니다.');
  }
};

const MenuApi = {
  getAllMenuByCategory(category) {
    return request(`${BASE_URL}/category/${category}/menu`);
  },
  createMenu(category, name) {
    return request(
      `${BASE_URL}/category/${category}/menu`,
      HTTP_METHOD.POST({ name }),
    );
  },
  async updateMenu(category, name, menuId) {
    //수정할 때는 PUT을 쓴다.
    return request(
      `${BASE_URL}/category/${category}/menu/${menuId}`,
      HTTP_METHOD.PUT({ name }),
    );
  },
  async toggleSoldOutMenu(category, menuId) {
    return request(
      `${BASE_URL}/category/${category}/menu/${menuId}/soldout`,
      HTTP_METHOD.PUT(),
    );
  },
  async removeMenu(category, menuId) {
    return requestWithOutJSON(
      `${BASE_URL}/category/${category}/menu/${menuId}`,
      HTTP_METHOD.DELETE(),
    );
  },
};

export default MenuApi;
