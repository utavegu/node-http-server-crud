const getAllOperationsComponent = (operations = []) => {
  let tableRows = operations.map(({ id, amount }, index) => {
    return (`
          <!-- НАЧАЛО tableRow -->

          <tr>
            <th>${++index}</th>
            <th>${amount}</th>
            <td>
              <a class="btn btn-sm btn-primary" href="/update?id=${id}">редактировать</a>
              <a class="btn btn-sm btn-danger" href="/delete?id=${id}">удалить</a>
            </td>
          </tr>

          <!-- КОНЕЦ tableRow -->
       `)
  }).join('');

  return (`
    <!-- НАЧАЛО AllOperationsComponent -->

    <a class="btn btn-primary" href="/create">Добавить запись</a>

    <table class="table table-striped table-sm  mt-3">
      <thead>
        <tr>
          <th scope="col">#</th>
          <th>сумма</th>
          <th>действие</th>
        </tr>
      </thead>
      <tbody>
        ${tableRows}
      </tbody>
    </table>

    <!-- КОНЕЦ AllOperationsComponent -->
  `)
};

module.exports = { getAllOperationsComponent };