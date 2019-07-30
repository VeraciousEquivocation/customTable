import React, { Component } from 'react';

import classNames from 'classnames';
import scss from './Traffic.module.scss';
import TrafficTable from './TrafficTable/TrafficTable';

import ErrorBoundary from '../../components/ErrorBoundary/ErrorBoundary';

class Traffic extends Component {
    state = {
        search: '',
        open: false,
        status: '',
        size: '',
        type: '',
        product: '',
		placement: '',
        headers: [
            {
                name: 'Product',
				width: 300,
				key: 'product'
            },
            {
                name: 'Placement',
                width: 300,
				key: 'placement',
                resize: true
            },
            {
                name: 'Size',
                width: 80,
				key: 'size',
            },
            {
                name: 'ABC',
                width: 80,
				key: 'abc',
            },
            {
                name: 'generic',
                width: 200,
				key: 'generic',
                resize: true
            },
            {
                name: 'Type',
                width: 100,
				key: 'type',
            },
            {
                name: 'URL',
                width: 350,
				key: 'url',
                resize: true
            },
            {
                name: 'Weight',
                width: 60,
				key: 'weight',
            },
            {
                name: 'Status',
                width: 150,
				key: 'status',
            }
		],
		data: [
			{
				product: 'data' ,
				selected: false,
				placements: [
					{
						selected: false,
						placement: 'data',
						size: '999x999',
						abc: 'AB/CC',
						generics: [
							{
								selected: false,
								generic: 'generic name',
								type: 'AB',
								url: 'www.ou.data',
								weight: 10,
								status: 'wandering ',
							},
						]
					},
					{
						selected: false,
						placement: 'data log 3',
						size: '999x999',
						abc: 'AB/CC',
						generics: [
							{
								selected: false,
								generic: 'generic name',
								type: 'AB',
								url: 'www.t.data/str/',
								weight: 10,
								status: 'wandering ',
							},
						]
					},
					{
						selected: false,
						placement: 'data number 77',
						size: '999x999',
						abc: 'AB/CC',
						generics: [
							{
								selected: false,
								generic: 'generic name',
								type: 'AB',
								url: 'www.z.data/string/o?&apple',
								weight: 10,
								status: 'eating pasta',
							},
							{
								selected: false,
								generic: 'second generic',
								type: 'AB',
								url: 'www.y.data/pie?&apple',
								weight: 10,
								status: 'growing pasta',
							},
						]
					},
				]
			},
			{
				product: 'POTATO' ,
				selected: false,
				placements: [
					{
						selected: false,
						placement: 'potato data 88',
						size: '999x999',
						abc: 'AB/CC',
						generics: [
							{
								selected: false,
								generic: 'generic name',
								type: 'AB',
								url: 'www.data/string/pie?&apple',
								weight: 10,
								status: 'wandering ',
							},
						],
					},
					{
						selected: false,
						placement: 'mashed potato cereal',
						size: '999x999',
						abc: 'AB/CC',
						generics: [
							{
								selected: false,
								generic: 'generic name',
								type: 'AB',
								url: 'www.random.data/string/pie?&apple',
								weight: 10,
								status: 'Lost at sea',
							},
						],
					},
					{
						selected: false,
						placement: 'empty generic one',
						size: '999x350',
						abc: 'AB/CC',
						generics: [
						],
					},
					{
						selected: false,
						placement: 'empty generic two',
						size: '720x350',
						abc: 'AB/CC',
						generics: [
						],
					},
					
				]
			},
		]
    };

    handleChange = event => {
        this.setState({ 
            [event.target.name]: event.target.value 
        });
    };
    handleTextFieldChange = name => event => {
        this.setState({
          [name]: event.target.value,
        });
    };
    handleFilterClick = () => {
        let currentDrawerState = this.state.open;
        this.setState({open:!currentDrawerState});
    };

    render () {
        const { open } = this.state;
		
        return (
            <React.Fragment>
				<div className={scss.root}>
					<div className={classNames(scss.TrafficContentContainer, {[scss[`TrafficContentContainer_open_${open}`]]:open})}>
						<ErrorBoundary usePaper>
							<TrafficTable headers={this.state.headers} rows={this.state.data} />
						</ErrorBoundary>
					</div>
				</div>
            </React.Fragment>
        )
    }
}

export default Traffic;