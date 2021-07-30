/// <reference path="jquery-3.4.1.intellisense.js" />


class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = { listItems: [], name: '', currentItem: null}
        this.handleContentChange = this.handleContentChange.bind(this);
    }

    Post = (destination, data, callback) => {
        const request = new XMLHttpRequest(),
            method = "POST",
            url = "https://localhost:44375/Text/" + destination;

        request.open(method, url);
        request.setRequestHeader("Content-Type", "application/json");

        request.onreadystatechange = function () {
            if (request.readyState === XMLHttpRequest.DONE) {
                var status = request.status;
                if (status === 0 || (status >= 200 && status < 400)) {
                    if (request.response != null && request.reponse != '') {
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

    fetchList = () => {
        this.Post("fetchList", null, (items) => {
            this.setState({ listItems: items.list });
        })
    }

    componentDidMount = () => {
        this.fetchList();
    };

    fetchItem = (id) => {
        this.Post("fetchItem", { id: id }, (item) => {
            this.setState({ currentItem: item });
        })
    }

    handleSubmit = (event) => {
        this.Post("AddTextRow", { Name: this.state.name }, () => {
            this.fetchList();
            this.setState({ name: "" });
        })
        event.preventDefault();
    }
  
    handleChange = (event) => {
        this.setState({ name: event.target.value });
    }


    handleContentChange = (event) => {
        let newItem = { ...this.state.currentItem };
        newItem.Content = event.target.value;
        this.setState({ currentItem: newItem });
    }
    
    handleContentSubmit = (event) => {
        let data = {
            ID: this.state.currentItem.ID,
            Content: this.state.currentItem.Content
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
        })
    }

    render = () => {
        const itemRows = this.state.listItems.map(item =>
            <tr key={item.ID}>
                <td onClick={() => this.fetchItem(item.ID)}>{item.ID}</td>
                <td onClick={() => this.fetchItem(item.ID)}>{item.Name}</td>
                <td> <button onClick={() => this.deleteItem(item.ID)}>Delete</button></td>
            </tr>);

        let currentDiv = null;
        if (this.state.currentItem != null) {
            currentDiv =
                <div>

                    <form onSubmit={this.handleContentSubmit}>
                        <textarea value={this.state.currentItem.Content} onChange={this.handleContentChange}> Enter Content </textarea>
                        <button> Save Changes </button>
                    </form>
                </div>;
        }

        return (
            <div>
                <table>
                    <tbody>
                        {itemRows}
                    </tbody>
                </table>
                <form onSubmit={this.handleSubmit}>
                    <input type="text" id="textBox" value={this.state.name} onChange={this.handleChange} />
                    <br />
                    <button> Add New Item </button> 
                </form>
                {/*<div contentEditable="true">{this.state.name}</div>*/}
                <div >{this.state.name}</div>

               {/*<div dangerouslySetInnerHTML={{ __html: this.state.name }}> </div>*/}
                {currentDiv}
            </div>
        )   
    }
}



