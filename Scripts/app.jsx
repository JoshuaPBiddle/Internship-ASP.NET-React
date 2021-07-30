/// <reference path="jquery-3.4.1.intellisense.js" />

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = { name: '', listItems: [], currentItem: null}
        this.handleChange = this.handleChange.bind(this);
        this.handleContentChange = this.handleContentChange.bind(this);
    }

    Post = (destination, data, callback) => {
        const request = new XMLHttpRequest(),
            method = "POST",
            url = "https://localhost:44375/Text/" + destination;

        request.open(method, url, true);
        request.setRequestHeader("Content-Type", "application/json");

        request.onreadystatechange = function () {
            if (request.readyState === XMLHttpRequest.DONE) {
                var status = request.status;
                if (status === 0 || (status >= 200 && status < 400)) {
                    if (request.response != null && request.response != '') {
                        callback(JSON.parse(request.response));
                    } else {
                        callback();
                    }
                }
            }
        };
        let dbEntry = JSON.stringify(data);
        request.send(dbEntry);
    }

    componentDidMount = () => {
        this.fetchList();
    };

    fetchList = () => {
        this.Post("fetchList", null, (items) => {
            this.setState({ listItems: items.list });
        })
    }

    fetchItem = (id) => {
        if (this.state.currentItem === null) {
            this.Post("fetchItem", { id: id },
                (item) => {
                    this.setState({ currentItem: item });
                })
        } else {
            this.setState({ currentItem: null });
            this.Post("fetchItem", { id: id },
                (item) => {
                    this.setState({ currentItem: item });
                })
        }
    } 

    handleSubmit = (event) => {
        event.preventDefault();
        this.Post("addItem", { Name: this.state.name }, () => {
            this.fetchList();
            this.setState({ name: '' });
        })
    }

    handleChange = (event) => {
        this.setState({ name: event.target.value });
    }

    handleContentChange = (event) => {
        let newItem = { ...this.state.currentItem };
        newItem.Content = event.target.value;
        this.setState({ currentItem: newItem });
        this.myComp();
    }

    handleContentSubmit = (event) => {
        let data = {
            ID: this.state.currentItem.ID,
            Content: this.state.currentItem.Content,
        };

        this.Post("handleContentSubmit", data, () => {
            this.fetchList();
            this.setState({ currentItem: null });
        });
        event.preventDefault();
    }

    deleteItem = (id) => {
        this.Post("deleteItem", { id: id }, () => {
            this.fetchList();
        });
    }

    exit = () => {
        this.setState({ currentItem: null });
    }

    render = () => {
        
        const itemRows = this.state.listItems.map(item =>
            <tr key={item.ID}>
                <td onClick={() => this.fetchItem(item.ID)}> {item.Name}</td>
                <td><button class="button" id="deleteButton" onClick={() => this.deleteItem(item.ID)}> <b>x</b> </button></td>
            </tr>
        );
    
        let currentDiv = null;
        if (this.state.currentItem != null) {
            currentDiv =
                <div class= "content">
                <h2 id="name">{this.state.currentItem.Name}:</h2>
                <button class="exit" onClick={this.exit}> X </button>
                    <form onSubmit={this.handleContentSubmit}>
                        <textarea id="contentBox" value={this.state.currentItem.Content} onChange={this.handleContentChange}> Enter Content </textarea>
                        <br />
                        <button class="button" id="saveContent"> Save Changes </button>
                </form>
                </div>
        }

        let renderedHTML = null;
        if (this.state.currentItem != null) {
            renderedHTML =
                <div id="content" dangerouslySetInnerHTML={{ __html: this.state.currentItem.Content }} />;
        }

        return (
            <div class="format">
                <table>
                    <tbody>
                        {itemRows}
                            <tr>
                                <td>
                                    <form onSubmit={this.handleSubmit}>
                                    <table>
                                        <br />
                                        <input  id="textBox" type="text" value={this.state.name} onChange={this.handleChange} />
                                    </table>
                                    </form>
                            </td>
                            <td> <button onClick={this.handleSubmit} class="button" id="addButton"><b>+</b></button></td>
                            </tr>
                    </tbody>
                </table>
                {currentDiv}
                {renderedHTML}
            </div>
        )
    }
}



