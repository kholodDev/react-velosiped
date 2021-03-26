const App = React.createElement(
    'div',
    { class: 'container' },
    React.createElement(
        'h1',
        { class: 'title' },
        'Step list'
    ),
    React.createElement(
        'ol',
        {
            class: 'list',
        },
        React.createElement(
            'li',
            {
                class: 'list-item',
            },
            'First row'
        ),
        React.createElement(
            'li',
            {
                class: 'list-item',
            },
            'Second row'
        ),
        React.createElement(
            'li',
            {
                class: 'list-item',
            },
            'Third row'
        ),
    )
)

const root = document.getElementById('app')

ReactDOM.render(App, root)
