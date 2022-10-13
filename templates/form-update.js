const getFormUpdateComponent = ({ id, amount }) => (`
  <!-- НАЧАЛО FormUpdateComponent -->

  <form
    method="POST"
    action="/update?id=${id}"
  >

    <input
      name="count" 
      type="number"
      value="${amount}"
    />

    <button
      class="btn btn-sm btn-outline-success" 
      type="submit"
    >
      сохранить
    </button>
    
  </form>

  <!-- КОНЕЦ FormUpdateComponent -->
`);

module.exports = { getFormUpdateComponent };