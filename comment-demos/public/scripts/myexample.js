var Comment = React.createClass({
    rawMarkup: function() {
        var rawMarkup = marked(this.props.children.toString(), {sanitize: true});
        return { __html: rawMarkup };
    },

    render: function() {
        return (
            <div className="comment">
                <h3 className="commentAuthor">
                    {this.props.author}
                </h3>
                <span dangerouslySetInnerHTML={this.rawMarkup()} />
            </div>
        );
    }
});

var SetIntervalMixin = {
    componentWillMount: function() {
        this.intervals = [];
    },
    setInterval: function() {
        this.intervals.push(setInterval.apply(null, arguments));
    },
    componentWillUnmount: function() {
        this.intervals.map(clearInterval);
    }
};

var CommentBox = React.createClass({
    mixins: [SetIntervalMixin],
    getInitialState: function() {
        return {data: []};
    },
    loadCommentsFromServer: function() {
        $.ajax({
            url: this.props.url,
            dataType: 'json',
            cache: false,
            success: function (data) {
                this.setState({data: data});
            }.bind(this),
            error: function(xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    },
    handleCommentSubmit: function(comment) {
        var comments = this.state.data;
        var newComments = comments.concat([comment]);
        this.setState({data: newComments});
        $.ajax({
            url: this.props.url,
            dataType: 'json',
            type: 'POST',
            data: comment,
            success: function (data) {
                this.setState({data: data});
            }.bind(this),
            error: function(xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    },
    componentDidMount: function() {
        this.loadCommentsFromServer();
        this.setInterval(this.loadCommentsFromServer, this.props.pollInterval);
    },
    render: function() {
        return (
            <div className="commentBox">
                <h1>Comments</h1>
                <CommentList data={this.state.data}/>
                <CommentForm onCommentSubmit={this.handleCommentSubmit}/>
            </div>
        );
    }
});

var CommentList = React.createClass({
    render: function() {
        var commentNodes = this.props.data.map(function (comment) {
            return (
                <Comment author={comment.author}>
                    {comment.text}
                </Comment>
            );
        });
        console.log('渲染');

        return (
            <div className="commentList">
                {commentNodes}
            </div>
        );
    }
});

var CommentForm = React.createClass({
    getInitialState: function() {
        return {author: '', text: ''};
    },
    handleSubmit: function(e) {
        e.preventDefault();
        var author = this.state.author.trim();
        var text = this.state.text.trim();
        if (!text || !author) {
            return;
        }
        this.props.onCommentSubmit({author: author, text:text});
        this.setState({author: '', text: ''});
    },
    handleAuthorChange: function(e) {
        this.setState({author: e.target.value});
    },
    handleTextChange: function(e) {
        this.setState({text: e.target.value});
    },
    render: function() {
        return (
            <form className="commentForm" onSubmit={this.handleSubmit}>
                <input
                    type="text"
                    placeholder="Your name"
                    value={this.state.author}
                    onChange={this.handleAuthorChange}
                />
                <input
                    type="text"
                    placeholder="Say something"
                    value={this.state.text}
                    onChange={this.handleTextChange}
                />
                <input type="submit" value="Post" />
            </form>
        );
    }
});

ReactDOM.render(
    <CommentBox url="/api/comments" pollInterval={2000}/>,
    document.getElementById('content')
);

//var CommentForm = React.createClass({
    //handleSubmit: function(e) {
        //e.preventDefault();
        //var author = this.refs.author.value.trim();
        //var text = this.refs.text.value.trim();
        //if (!text || !author) {
            //return;
        //}
        //this.props.onCommentSubmit({author: author, text:text});
        //this.refs.author.value = '';
        //this.refs.text.value = '';
        //return;
    //},
    //render: function() {
        //return (
            //<form className="commentForm" onSubmit={this.handleSubmit}>
                //<input type="text" placeholder="Your name" ref="author"/>
                //<input type="text" placeholder="Say something" ref="text"/>
                //<input type="submit" value="Post" />
            //</form>
        //);
    //}
//});


//var data = [
    //{author: "Yannyezixin", text: "默认评论1"},
    //{author: "JsonJam", text: "默认评论 **2**"}
//];
//ReactDOM.render(
    //<CommentBox data={data} />,
    //document.getElementById('content')
//);

//var commentBox = <div className="commentBox">Hello, world! I am a CommentBox</div>;
//ReactDOM.render(commentBox, document.getElementById('content'));
