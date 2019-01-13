import get from 'lodash-es/get';
import has from 'lodash-es/has';
import * as React from 'react';
import { ActionCreator, connect } from 'react-redux';
import { Action, popPending, pushPending } from '../../../data';
require('./Quote.sass');

interface Props {
  category?: string;
  local?: Data;
  popPending: ActionCreator<Action>;
  pushPending: ActionCreator<Action>;
  setLocal: (state: Data) => void;
}

interface Data {
  author?: string;
  date: number;
  quote: string;
}

class Quote extends React.PureComponent<Props> {
  constructor(props: Props) {
    super(props);
    if (new Date().getDate() !== get(this.props, 'local.date')) {
      this.getQuote(this.props).then(quote => this.props.setLocal(quote));
    }
  }

  componentDidUpdate(prevProps: Props) {
    if (this.props.category !== prevProps.category) {
      this.getQuote(this.props).then(quote => this.props.setLocal(quote));
    }
  }

  render() {
    return (
      <h4 className="Quote">
        "{get(this.props, 'local.quote')}"
        {has(this.props, 'local.author') && <sub><br />&mdash; {get(this.props, 'local.author')}</sub>}
      </h4>
    );
  }

  // Get a quote
  private async getQuote({ category }: Props): Promise<Data> {
    this.props.pushPending();

    const quote = category === 'developerexcuses'
      ? await this.getDeveloperExcuse()
      : await this.getQuoteOfTheDay(category);

    this.props.popPending();

    return quote;
  }

  // Get developer excuse
  private async getDeveloperExcuse(): Promise<Data> {
    try {
      const res = await fetch(`${process.env.API_ENDPOINT}/developer-excuses`);
      const body = await res.json();

      return {
        date: new Date().getDate(),
        quote: body.data,
      };
    } catch (err) {
      return {
        date: 0,
        quote: 'Unable to get a new developer excuse.',
      };
    }
  }

  // Get quote of the day
  private async getQuoteOfTheDay(category?: string): Promise<Data> {
    const res = await fetch('https://quotes.rest/qod.json' + (category ? `?category=${category}` : ''));
    const body = await res.json();

    if (res.status === 429) {
      return {
        author: body.error.message.split('.')[1] + '.',
        date: 0,
        quote: 'Too many requests this hour.',
      };
    }

    return {
      author: get(body, 'contents.quotes[0].author'),
      date: new Date().getDate(),
      quote: get(body, 'contents.quotes[0].quote'),
    };
  }
}

const mapDispatchToProps = { popPending, pushPending };

export default connect(null, mapDispatchToProps)(Quote);
