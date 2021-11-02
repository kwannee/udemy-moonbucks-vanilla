import { $ } from './utils/dom.js';
import store from './store/index.js';
import MenuApi from '../api/index.js';

//객체는 하나만 있는게 좋아서 원래 $랑 store 있었는데 다 분리하고 이거만 남겨 둠.
function App() {
  //상태는 변하는 데이터, 메뉴명
  //초기화는 반드시 해주는게 좋다. 다른 사람이 봤을때 어떻게 관리되는지
  //알려줄 수 있음.
  //this는 객체가 인스턴스로 만들어졌을때 '''''각각의!!!!''''' 상태와 메서드를 사용할 수 있도록 하기 위해서
  this.menu = {
    espresso: [],
    frappuccino: [],
    blended: [],
    teavana: [],
    desert: [],
  };
  this.currentCategory = 'espresso';
  this.init = async () => {
    render();
    initEventListener();
  };

  //이 함수 원래는 리스너 안에 그냥 있었는데 나중에 보면 이해하기 어려울 수 있어서
  //따로 함수로 뺐다.
  const editMenuName = async (e) => {
    const menuId = e.target.closest('li').dataset.menuId;
    const $menuName = e.target.closest('li').querySelector('.menu-name');
    const menuName = $menuName.innerText;
    const edittedMenuName = prompt('메뉴명을 수정하세요.', menuName);
    if (edittedMenuName === null) {
      $menuName.innerText = menuName;
      return;
    }
    await MenuApi.updateMenu(this.currentCategory, edittedMenuName, menuId);
    render();
  };
  const addMenuName = async () => {
    if ($('#menu-name').value === '') {
      alert('값을 입력해 주세요.');
      return;
    }
    const duplicatedItem = this.menu[this.currentCategory].find(
      (item) => $('#menu-name').value === item.name,
    );
    if (duplicatedItem) {
      $('#menu-name').value = '';
      alert('이미 등록된 메뉴입니다.');
      return;
    }
    const menuName = $('#menu-name').value;
    //post는 객체 생성할 때
    await MenuApi.createMenu(this.currentCategory, menuName);
    render();
    $('#menu-name').value = '';
    //this.menu[this.currentCategory].push({ name: menuName });

    //innerHTML += 를 하면 전체 다 바꾸는거라서 성능상에 문제가 있을 수 있다.
    // $('#menu-list').insertAdjacentHTML(
    //   'afterBegin',
    //   menuItemTemplate(espressoMenuName),
    // );
  };
  const updateMenuCnt = () => {
    const menuCnt = this.menu[this.currentCategory].length;
    $('.menu-count').innerText = `총 ${menuCnt}개`;
  };
  const removeMenuName = async (e) => {
    if (confirm('정말 삭제하시겠습니까?')) {
      const menuId = e.target.closest('li').dataset.menuId;
      await MenuApi.removeMenu(this.currentCategory, menuId);
      render();
      updateMenuCnt();
    }
  };
  const soldOutMenu = async (e) => {
    const menuId = e.target.closest('li').dataset.menuId;
    await MenuApi.toggleSoldOutMenu(this.currentCategory, menuId);
    this.menu[this.currentCategory] = await MenuApi.getAllMenuByCategory(
      this.currentCategory,
    );
    render();
  };
  const render = async () => {
    this.menu[this.currentCategory] = await MenuApi.getAllMenuByCategory(
      this.currentCategory,
    );
    const template = this.menu[this.currentCategory]
      .map((item, index) => {
        return `<li data-menu-id=${
          item.id
        } class=" menu-list-item d-flex items-center py-2">
      <span class="${item.isSoldOut ? 'sold-out' : ''} w-100 pl-2 menu-name">${
          item.name
        }</span>
      <button
        type="button"
        class="bg-gray-50 text-gray-500 text-sm mr-1 menu-sold-out-button"
      >
        품절
      </button>
      <button
        type="button"
        class="bg-gray-50 text-gray-500 text-sm mr-1 menu-edit-button"
      >
        수정
      </button>
      <button
        type="button"
        class="bg-gray-50 text-gray-500 text-sm menu-remove-button"
      >
        삭제
      </button>
    </li>`;
      })
      .join('');
    $('#menu-list').innerHTML = template;
    updateMenuCnt();
  };
  const changeCategory = (e) => {
    const isCategoryButton = e.target.classList.contains('cafe-category-name');
    if (isCategoryButton) {
      const categoryName = e.target.dataset.categoryName;
      this.currentCategory = categoryName;
      $('#category-title').innerText = e.target.innerText + ' 메뉴 관리';
      render();
    }
  };

  const initEventListener = () => {
    //이벤트 위임. html에는 아직 수정버튼이 없기ㅣ 떄문에 상위 엘레먼트한테
    //이벤트를 일단 위임해놓고, 나중에 엘리먼트가 생기면 실행할 수 있도록 함
    $('#menu-list').addEventListener('click', (e) => {
      if (e.target.classList.contains('menu-edit-button')) {
        editMenuName(e);
        return;
      }
      if (e.target.classList.contains('menu-remove-button')) {
        removeMenuName(e);
        return;
      }
      if (e.target.classList.contains('menu-sold-out-button')) {
        soldOutMenu(e);
        return;
      }
    });

    //form이 자동으로 전송되는 걸 막아준다.
    $('#menu-form').addEventListener('submit', (e) => {
      e.preventDefault();
    });

    $('#menu-submit-button').addEventListener('click', addMenuName);

    //id는 한페이지당 하나만 있어야 한다. element 선택은 id값으로 하는게 좋다.
    $('#menu-name').addEventListener('keyup', (e) => {
      if (e.key !== 'Enter') {
        return;
      }
      addMenuName();
    });

    //이벤트 핸들러에 인라인으로 돼 있으면 어떤 처리인지 코드를 다 읽어봐야만 알 수 있다.
    //따라서 분리시켜줘야 한다.
    $('nav').addEventListener('click', changeCategory);
  };
}

const app = new App();
app.init();
