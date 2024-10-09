import formatDateTime from '@/common/formatDateTime';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import { ProColumns } from '@ant-design/pro-table/lib';
import { FormattedMessage, useIntl } from '@umijs/max';
import { Button, message, Space, Typography } from 'antd';
import React, { useEffect, useState } from 'react';

const TableList: React.FC = () => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [dataSource, setDataSource] = useState<API.Bet[]>([]);
  const intl = useIntl();

  useEffect(() => {
    fetch('/arbs.json')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network error');
        }
        return response.json();
      })
      .then((data) => {
        setDataSource(data.arbitrage_data);
      })
      .catch((error) => {
        console.error('Error fetching the data:', error);
      });
  }, []);

  const columns: ProColumns<API.Bet>[] = [
    {
      title: 'key',
      hideInTable: true,
      renderText: (_, record) =>
        `${record.game_id}${record.best_price_home_odd_books}${record.best_price_away_odd_books}`,
    },
    {
      title: <FormattedMessage id="pages.arbTable.columnName.arb_percent" defaultMessage="Arb %" />,
      dataIndex: 'arb_percent',
      sorter: (a, b) => a.arb_percent - b.arb_percent,
      hideInForm: true,
      renderText: (text: string) => `${text}%`,
    },
    {
      title: <FormattedMessage id="pages.arbTable.columnName.market" defaultMessage="Market" />,
      filters: [...new Set(dataSource.map((bet) => bet.market))].map((item) => ({
        text: item,
        value: item,
      })),
      dataIndex: 'market',
      filterSearch: true,
      onFilter: (value, record) => {
        console.log('value', value);
        return record.market.indexOf(value as string) === 0;
      },
      sorter: (a, b) => a.market.length - b.market.length,
      renderText: (text: string) => text,
    },
    {
      title: <FormattedMessage id="pages.arbTable.columnName.event" defaultMessage="Event" />,
      dataIndex: 'event',
      renderText: (text, record) => (
        <Space>
          <Typography.Text>
            {record.home_team} vs. {record.away_team} at {formatDateTime.fromISO(record.start_date)}
          </Typography.Text>
        </Space>
      ),
      filterSearch: true,
      onFilter: (value, record) => {
        console.log('value', value);
        return record.market.indexOf(value as string) === 0;
      },
      sorter: (a, b) => a.market.length - b.market.length,
    },
    {
      title: <FormattedMessage id="pages.arbTable.columnName.bet_1" defaultMessage="Bet 1" />,
      filterSearch: true,
      onFilter: (value, record) => {
        console.log('value', value);
        return record.market.indexOf(value as string) === 0;
      },
      sorter: (a, b) => a.market.length - b.market.length,
      renderText: (text, record) => `${record.home_team} ${record.market}`,
    },
    {
      title: <FormattedMessage id="pages.arbTable.columnName.bet_2" defaultMessage="Bet 2" />,
      filterSearch: true,
      onFilter: (value, record) => {
        console.log('value', value);
        return record.market.indexOf(value as string) === 0;
      },
      sorter: (a, b) => a.market.length - b.market.length,
      renderText: (text, record) => `${record.away_team} ${record.market}`,
    },
  ];

  const handleRemove = () => {
    try {
      if (!Array.isArray(selectedRowKeys) || selectedRowKeys.length === 0) {
        message.warning('No rows selected');
        return;
      }

      const updatedData = dataSource.filter(
        (item) => !selectedRowKeys.includes(`${item.game_id}-${item.best_price_home_name}`),
      );
      setDataSource(updatedData);
      setSelectedRowKeys([]);
      message.success('Successfully removed arbitrage bets');
    } catch (error) {
      message.error('Failed to remove arbitrage bets');
    }
  };

  return (
    <PageContainer>
      <ProTable<API.Bet, API.PageParams>
        headerTitle={intl.formatMessage({
          id: 'pages.arbTable.title',
          defaultMessage: 'Arbitrage Bets',
        })}
        rowKey={(record) => `${record.game_id}-${record.best_price_home_name}`}
        search={false}
        toolBarRender={() => [
          <Button key="remove-arb" onClick={handleRemove}>
            Remove
          </Button>,
        ]}
        options={{
          reload: undefined,
        }}
        rowSelection={{
          type: 'checkbox',
          selectedRowKeys,
          onChange: (selectedRowKeys) => {
            setSelectedRowKeys(selectedRowKeys);
          },
        }}
        dataSource={dataSource}
        columns={columns}
      />
    </PageContainer>
  );
};

export default TableList;
