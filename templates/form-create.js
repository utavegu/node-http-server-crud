const getFormCreateComponent = () => (`
  <!-- НАЧАЛО FormCreateComponent -->

  <form 
    method="POST"
    action="/create"
  >

    <input
      name="count"
      type="number"
      required
    />

    <button
      class="btn btn-sm btn-success"
      type="submit"
    >
      создать
    </button>

  </form>

  <!-- КОНЕЦ FormCreateComponent -->
`);

module.exports = { getFormCreateComponent };