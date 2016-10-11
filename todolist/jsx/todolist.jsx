var Server = {
    data: [
        {id: 1, text: "9点 整理购书清单"},
        {id: 2, text: "11 点外出办事"},
        {id: 3, text: "明天上医院"},
        {id: 4, text: "回家"},
    ],
    getAllData: function () {
        return {
            'status': true,
            'data': this.data.slice()
        }
    },
    addOne: function (todo) {
        if (!todo) {
            return;
        }
        var id = this.data.length + 1;
        this.data.push({id: id, text: todo});
        return {
            'status': true,
            'data': {'id': id, text: todo}
        }
    }
}

var Todo = React.createClass({
    render: function () {
        return (
            <li className="list-group-item">{this.props.children}</li>
        );
    }
})

var TodoList = React.createClass({
    render: function () {
        var todoNodes = this.props.data.map(function (todo) {
            return (
                <Todo key={todo.id}>{todo.text}</Todo>
            );
        })
        return (
            <ul className="list-group">
                {todoNodes}
            </ul>
        );
    }
});

var TodoForm = React.createClass({
    getInitialState: function () {
        return {text: ''}
    },
    handleTextChange: function (e) {
        this.setState({text: e.target.value});
    },
    handleSubmit: function (e) {
        e.preventDefault();
        var todo = this.state.text;
        if (!todo) {
            return;
        }
        this.props.onTodoSubmit({text: this.state.text});
        this.setState({text: ''});
    },
    render: function () {
        return (
            <form role="form" className="todoForm" onSubmit={this.handleSubmit} >
                <input
                    className="form-control"
                    placeholder="你下一步打算做什么?"
                    value={this.state.text}
                    onChange={this.handleTextChange}
                />
            </form>
        );
    }
});

var TodoBox = React.createClass({
    getInitialState: function () {
        return {data: []};
    },
    componentDidMount: function () {
        // 这里应该是向服务器请求数据，我仅仅做了个模拟
        var data = Server.getAllData();

        if (data.status === true) {
            var data = data.data;
            this.setState({'data': data});
        }
    },
    handleTodoSumbit: function (todo) {
        var result = Server.addOne(todo.text);
        if (result.status === true) {
            var data = this.state.data.concat([result.data]);
            this.setState({'data': data});
        }
    },
    render: function () {
        return (
            <div className="col-md-4">
                <div className="panel panel-default">
                    <div className="panel-heading">TODOList - 开胃菜</div>
                    <TodoList data={this.state.data} />
                </div>
                <TodoForm onTodoSubmit={this.handleTodoSumbit} />
            </div>
        );
    }
});

ReactDOM.render(
    <TodoBox />,
    document.getElementById('con')
);
