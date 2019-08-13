$(document).ready(function(){
    $('.tabs__caption').on('click', 'button.tab:not(.active)', function (event) {
        event.preventDefault();
        $(this)
            .addClass('active').siblings().removeClass('active')
            .closest('div.tabs').find('div.content').removeClass('active').eq($(this).index()).addClass('active');
        $('#collapseExample').collapse('hide')
        $('form.addForm').trigger('reset');
    });
});
function todo() {
    var addBtn = $('.addForm :button.add');
    var currentBtn = '<td class="tAct">' + '<button class = "btnCreate">' + '<i class="fas fa-pencil-alt"></i>' + '</button>' + '<button class = "btnCompleted">' + '<i class="far fa-check-circle"></i>' + '</button>' + '<button class = "btnDelete">' + '<i class="far fa-trash-alt"></i>' + '</button>' + '</td>';
    var completedBtn = '<td class="tAct">' + '<button class = "btnCreate">' + '<i class="fas fa-pencil-alt"></i>' + '</button>' + '<button class = "btnDelete">' + '<i class="far fa-trash-alt"></i>' + '</button>' + '</td>';
    var deleteBtn = '<td class="tAct">' + '<button class = "btnRestore">' + '<i class="fas fa-undo-alt"></i>' + '</button>' + '</td>';
    var task = {
        current: [],
        completed: [],
        deleted: []
    };
    var index;
    var tab;
    (function init(){
        if(localStorage.getItem('myTodo')){
            task = JSON.parse(localStorage.getItem('myTodo'));
            out(task.current, currentBtn, $('.current .table-body'));
            out(task.completed, completedBtn, $('.completed .table-body'));
            out(task.deleted, deleteBtn, $('.deleted .table-body'));
        };
        event();
    })();
    function event() {
        addBtn.on('click', function () {
            validate()
        });
        $(document).on('click', '.btnDelete', function () {
            var index = this.closest('tr').rowIndex - 1;
            var elem = this.closest('tr');
            var tab = $('.content.active').data().event;
            deleteTask(index, tab, elem);
        });
        $(document).on('click', '.btnRestore', function () {
            var index = this.closest('tr').rowIndex - 1;
            var elem = this.closest('tr');
            var tab = $('.content.active').data().event;
            restoreTask(index, tab, elem)
        });
        $(document).on('click', '.btnCompleted', function () {
            var index = this.closest('tr').rowIndex - 1;
            var elem = this.closest('tr');
            completedTask(index, elem)
        });
        $(document).on('click', '.btnCreate', function () {
                index = this.closest('tr').rowIndex - 1;
                tab = $('.content.active').data().event;
                setValue(index, tab);
            }
        );
        $(document).on('click', '.create', function () {
            createTask(tab, index);
            resetForm()
        });
        $(document).on('click', '.reset', function () {
            resetForm()
        });
        $(document).on('click', ':button.clear', function () {
            clearLocal();
        })
    }
    //------Функция на добавление задачи-----
    function addTask() {
        var newTask = {};
        newTask.name = $(".addForm input[name='name']").val();
        newTask.description = $(".addForm input[name='description']").val();
        newTask.priority = $(".addForm input[name='priority']:checked").val();
        task.current.push(newTask);
        $('#collapseExample').collapse('hide');
        $('form.addForm').trigger('reset');
        out(task.current, currentBtn, $('.current .table-body'));
        localStorage.setItem('myTodo', JSON.stringify(task));
    }
    //-----Функция на проверку------
    function validate() {
        if ($(':button').hasClass('add')) {
            if ($(".addForm")[0].checkValidity()) {
                addTask();
            } else {
                $(".addForm")[0].reportValidity();
            }
        }
    }
    //-----Функция на вывод в таблице-----
    function out(data, buttons, tab) {
        var outCreate = '';
        for (var i = 0; i < data.length; i++) {
            outCreate += '<tr class="strTable">' + '<td class="tName">' + data[i].name + '</td>' + '<td class="tDescription">' + data[i].description + '</td>' + '<td class="tPriority">' + data[i].priority + '</td>' + buttons + '</tr>'
        }
        tab.html(outCreate);
        colorTable()
    }
    //-----Функция на удаление-----
    function deleteTask(index, tab, elem) {
        task.deleted.push(task[tab][index]);
        task[tab].splice(index, 1);
        elem.remove(index);
        out(task.deleted, deleteBtn, $('.deleted .table-body'));
        localStorage.setItem('myTodo', JSON.stringify(task));
    }
    //-----Функция на восстановление-----
    function restoreTask(index, tab, elem) {
        elem.remove(index);
        task.current.push(task[tab][index]);
        task[tab].splice(index, 1);
        out(task.current, currentBtn, $('.current .table-body'));
        localStorage.setItem('myTodo', JSON.stringify(task));
    }
    //-----Функция на перенос в выполненные-----
    function completedTask(index, elem) {
        var completedTask = task.current[index];
        task.current.splice(index, 1);
        elem.remove(index);
        task.completed.push(completedTask);
        out(task.completed, completedBtn, $('.completed .table-body'));
        localStorage.setItem('myTodo', JSON.stringify(task));
    }
    //-----Функция на изменение задачи-----
    function createTask(tab, index) {
        $('#exampleModalCenter').modal('hide');
        if (tab === 'current') {
            task.current[index].name = $(".createForm input[name='name']").val();
            task.current[index].description = $(".createForm input[name='description']").val();
            task.current[index].priority = $(".createForm input[name='priority']:checked").val();
            out(task.current, currentBtn, $('.current .table-body'));
            localStorage.setItem('myTodo', JSON.stringify(task));
        } else if (tab === 'completed') {
            task.completed[index].name = $(".createForm input[name='name']").val();
            task.completed[index].description = $(".createForm input[name='description']").val();
            task.completed[index].priority = $(".createForm input[name='priority']:checked").val();
            out(task.completed, completedBtn, $('.completed .table-body'));
            localStorage.setItem('myTodo', JSON.stringify(task));
        }
    }
    //-----Сброс формы-----
    function resetForm() {
        $('#collapseExample').collapse('hide');
        $('form.addForm').trigger('reset');
        $('form.createForm').trigger('reset');
    }
    //-----Очистка локального хранилища-----
    function clearLocal() {
        var result = confirm('Очистить Todo?');
        if (result) {
            localStorage.removeItem('myTodo');
            location.reload()
        }
    }
    //-----Заполнение модального окна данными из строки при редактирование-----
    function setValue(index, tab) {
        $('#exampleModalCenter').modal('show');
        $(".createForm input[name='name']").attr('value', task[tab][index].name);
        $(".createForm input[name='description']").attr('value', task[tab][index].description);
    };
    //-----Изменение строк таблицы в зависимости от приоритета-----
    function colorTable() {
        var tablePriority = $('.tPriority');
        for (var i = 0; i < tablePriority.length; i++) {
            if (tablePriority[i].innerHTML === 'Триальное') {
                $(tablePriority[i].closest('tr')).css('background-color', '#DBFFA4')
            }
            if (tablePriority[i].innerHTML === 'Срочное') {
                $(tablePriority[i].closest('tr')).css('background-color', '#FFA4A4')
            }
            if (tablePriority[i].innerHTML === 'Бессрочное') {
                $(tablePriority[i].closest('tr')).css('background-color', '#FFE6A4')
            }
        }
    }
}
todo();