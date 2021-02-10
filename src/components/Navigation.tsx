import * as React from 'react';
import { CommandBar, ICommandBarItemProps } from 'office-ui-fabric-react/lib/CommandBar';
import history from '../history';
import './Navigation.css';

class Navigation extends React.Component {
    _items: ICommandBarItemProps[] = [
        {
            key: 'conversations',
            text: 'Conversations',
            iconProps: { iconName: 'OfficeChat' },
            onClick: () => { history.push('/conversations') },
        },
        {
            key: 'billboard',
            text: 'Billboard',
            iconProps: { iconName: 'Boards' },
            onClick: () => { history.push('/billboard') },
        },
        {
            key: 'contacts',
            text: 'Contacts',
            iconProps: { iconName: 'ContactList' },
            onClick: () => { history.push('/contacts') },
        },
    ];

    _farItems: ICommandBarItemProps[] = [
        {
            key: 'profile',
            text: 'Profile',
            ariaLabel: 'Profile',
            iconOnly: true,
            iconProps: { iconName: 'Contact' },
            onClick: () => { history.push('/profile') },
        },
        {
            key: 'settings',
            text: 'Settings',
            ariaLabel: 'Settings',
            iconOnly: true,
            iconProps: { iconName: 'Settings' },
            onClick: () => { history.push('/settings') },
        },
    ];

    render() {
        return <CommandBar
            items={this._items}
            farItems={this._farItems}
            ariaLabel="Use left and right arrow keys to navigate between commands"
            className="navigation"
        />;
    }
}

// export default withRouter(Navigation)
export default Navigation
