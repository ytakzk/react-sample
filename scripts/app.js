/** @jsx React.DOM */

var Router = ReactRouter;
var Route = ReactRouter.Route;
var Routes = ReactRouter.Routes;
var DefaultRoute = ReactRouter.DefaultRoute;
var Link = Router.Link;

var HOST = 'https://qiita.com/api/v1';
var http = {
  items: function() {
    var defer = $.Deferred();
    $.ajax({
      url: HOST+'/items',
      dataType: 'json',
      success: defer.resolve,
      error: defer.reject
    });
    return defer.promise();
  },
  itemsIntag: function(tag) {
    var defer = $.Deferred();
    $.ajax({
      url: HOST+'/tags/'+tag+'/items',
      dataType: 'json',
      success: defer.resolve,
      error: defer.reject
    });
    return defer.promise();
  },
  tags: function() {
    var defer = $.Deferred();
    $.ajax({
      url: HOST+'/tags',
      dataType: 'json',
      success: defer.resolve,
      error: defer.reject
    });
    return defer.promise();    
  }
};

var Main = React.createClass({
  getInitialState: function() {
    return {data: []};
  },
  componentDidMount: function() {
    var that = this;
    if (this.props.params.tagId !== undefined) {
      http.itemsIntag(this.props.params.tagName).done(function(data) {
        that.setState({data: data});
      });
    } else {
      http.items().done(function(data) {
        that.setState({data: data});
      });
    }
  },
  componentWillReceiveProps: function(nextProps) {
    var that = this;
    if (nextProps.params.tagName !== undefined) {
      http.itemsIntag(nextProps.params.tagName).done(function(data) {
        that.setState({data: data});
      });
    } else {
      http.items().done(function(data) {
        that.setState({data: data});
      });
    }
  },
  render: function() {
    var work = this.state.data.map(function(work) {
      return (
        <List key={work['id']} title={work['title']}
               category={work['Category']}
                url={work['url']}
                image={work['user']['profile_image_url']}>
        </List>
      );
    });
    return (
      <section className="main">
        <ul>
          {work}
        </ul>
      </section>
    );
  }
});

var List = React.createClass({
  render: function() {
    return (
      <li className="list">
        <a href={this.props.url} target="_blank">
          <span ref="img" className="image">
            <img src={this.props.image} width="80"/>
          </span>
          <span className="name">
            <p className="title">{this.props.title}</p>
          </span>
        </a>
      </li>
    );
  }
});

var About = React.createClass({
  render: function() {
    return (
      <section className="about">
        <h1 className="bold">React</h1>
        <p>React is a JavaScript library for creating user interfaces by Facebook and Instagram.</p>
        <br/>
        <p>Many people choose to think of React as the V in MVC.</p>
        <br/>
        <p>Simply express how your app should look at any given point in time,</p>
        <p>and React will automatically manage all UI updates when your underlying data changes.</p>
        <br/>
        <p>When the data changes, React conceptually hits the refresh button, and knows to only update the changed parts.</p>
        <br/>
        <p><a href="http://facebook.github.io/react/">{'http://facebook.github.io/react/'}</a></p>
      </section>
    );
  }
});

var Menu = React.createClass({
  getInitialState: function() {
    return {data: []};
  },
  componentDidMount: function() {
    var that = this;
    http.tags().done(function(data) {
      that.setState({data: data});
    });
  },
  render: function() {
    var tags = this.state.data.map(function(tag) {
      return (
        <li key={tag['name']}><Link to="tag" params={{tagName: tag['name']}}>{tag['name']}</Link></li>
      );
    });
    return (
      <ul>
        <li><Link to="about">{'What\u0027s React?'}</Link></li>
        <span>TAGS</span>
        {tags}
      </ul>
    );
  }
});

var App = React.createClass({  
  render: function() { 
    return (
      <div className="container">
      <header>
        <h1><a href="#" className="title">REACTJS TEST</a></h1>
        <Menu />
      </header>
      <this.props.activeRouteHandler/>
      </div>
    );
  }
});

var routes = (
  <Routes>
    <Route name="app" path="/" handler={App}>
      <Route name="about" handler={About}/>
      <Route name="tag" path=":tagName" handler={Main} />
      <DefaultRoute handler={Main}/>
    </Route>
  </Routes>
);

React.renderComponent(routes, document.getElementById('content'));