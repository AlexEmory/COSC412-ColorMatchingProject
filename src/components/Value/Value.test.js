import React from 'react';
import ReactDOM from 'react-dom';
import Value from './index';
import { mount, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Value />, div);
});

it('renders with a span when given a value', () => {
  const testValue = 335;

  let wrapper = mount(<Value value={testValue}/>);
  expect(wrapper.containsMatchingElement(<span>{testValue}</span>)).toBe(true);
});

it('respects min/max', () => {
  let onChange = jest.fn();

  let wrapper = mount(<Value min={-100} max={100} onChange={onChange}/>);
  let input = wrapper.find('input');

  input.simulate('change', {
    target: { value: Number.MAX_SAFE_INTEGER }
  });
  wrapper.update();

  expect(onChange).toHaveBeenLastCalledWith(100);
});
