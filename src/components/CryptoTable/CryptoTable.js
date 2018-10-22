import React, { Component } from 'react';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import { connect } from 'react-redux';
import { loadCurrencies } from '../../modules/currency';

const columns = [
  {
    Header: '#',
    accessor: 'rank',
    width: 50
  },
  {
    Header: 'Name',
    Cell: row => {
      return (
        <div>
          <img
            alt={''}
            src={`https://s2.coinmarketcap.com/static/img/coins/16x16/${
              row.original.id
            }.png`}
          />
          <span> {row.original.name}</span>
        </div>
      );
    },
    id: 'name',
    width: 400
  },
  {
    Header: 'Market Cap',
    Cell: row => {
      return (
        <div>
          <span>${row.original.quotes.USD.market_cap}</span>
        </div>
      );
    },
    id: 'market_cap'
  },
  {
    Header: 'Price',
    Cell: row => {
      return (
        <div>
          <span>${row.original.quotes.USD.price}</span>
        </div>
      );
    },
    id: 'price'
  },
  {
    Header: 'Volume (24h)',
    Cell: row => {
      return (
        <div>
          <span>${row.original.quotes.USD.volume_24h}</span>
        </div>
      );
    },
    id: 'volume_24h'
  },
  {
    Header: 'Circulating Supply',
    Cell: row => {
      return (
        <div>
          <span>
            {row.original.total_supply} {row.original.symbol}
          </span>
        </div>
      );
    },
    id: 'total_supply'
  },
  {
    Header: 'Change (24h)',
    Cell: row => {
      return (
        <div>
          <span>{row.original.quotes.USD.percent_change_24h}%</span>
        </div>
      );
    },
    id: 'percent_change_24h'
  }
];

class CryptoTable extends Component {
  state = {
    pages: 0,
    pageSize: 20
  };

  getData = tableData => {
    const { fetchData } = this.props;
    const { pageSize } = this.state;

    if (pageSize !== tableData.pageSize) {
      this.setState({ pageSize: tableData.pageSize });
    }

    fetchData(tableData.page, tableData.pageSize, tableData.sorted[0]);
  };

  setPages() {
    const { currencies } = this.props;
    const { pageSize, pages } = this.state;
    const currPages = Math.ceil(
      currencies.metadata.num_cryptocurrencies / pageSize
    );

    if (currPages !== pages) {
      this.setState({ pages: currPages });
    }
  }

  componentDidUpdate() {
    const { currencies } = this.props;

    if (currencies.metadata) {
      this.setPages();
    }
  }

  render() {
    const { currencies, isLoading, error } = this.props;
    const { pages } = this.state;

    return (
      <div>
        <h1>Crypto Currencies Rates</h1>
        {error && (
          <div>
            <strong>{error}</strong>
          </div>
        )}
        <ReactTable
          data={currencies.data}
          pages={pages}
          columns={columns}
          loading={isLoading}
          defaultPageSize={20}
          manual
          onFetchData={this.getData}
        />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  currencies: state.currencies.data,
  isLoading: state.currencies.isLoading,
  error: state.currencies.error
});

const mapDispatchToProps = {
  fetchData: loadCurrencies
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CryptoTable);
