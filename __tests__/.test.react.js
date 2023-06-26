const PhoneInput = require("../src/components/PhoneInput.js").default;
const userEvent = require("@testing-library/user-event").default;
const { render, screen } = require("@testing-library/react");
require("@testing-library/jest-dom");
const globalStore = {user: null, input: null}

describe("React component renders the proper phone format", () => {
  
  beforeEach(async () => {
    await setupReact();
  });  

  it("Typing '1' formats to '1'", async () => {
    const { user, input } = globalStore;
    await user.type(input, "1");
    expect(input.value).toBe("1");
  });

  it("Typing '12' formats to '12'", async () => {
    const { user, input } = globalStore;
    await user.type(input, "12");
    expect(input.value).toBe("12");
  });

  it("Typing '123' formats to '123'", async () => {
    const { user, input } = globalStore;
    await user.type(input, "123");
    expect(input.value).toBe("123");
  });

  it("Typing '1234' formats to '(123) 4'", async () => {
    const { user, input } = globalStore;
    await user.type(input, "1234");
    expect(input.value).toBe("(123) 4");
  });

  it("Typing '12345' formats to '(123) 45'", async () => {
    const { user, input } = globalStore;
    await user.type(input, "12345");
    expect(input.value).toBe("(123) 45");
  });

  it("Typing '123456' formats to '(123) 456'", async () => {
    const { user, input } = globalStore;
    await user.type(input, "123456");
    expect(input.value).toBe("(123) 456");
  });

  it("Typing '1234567' formats to '(123) 456-7'", async () => {
    const { user, input } = globalStore;
    await user.type(input, "1234567");
    expect(input.value).toBe("(123) 456-7");
  });

  it("Typing '12345678' formats to '(123) 456-78'", async () => {
    const { user, input } = globalStore;
    await user.type(input, "12345678");
    expect(input.value).toBe("(123) 456-78");
  });

  it("Typing '123456789' formats to '(123) 456-789'", async () => {
    const { user, input } = globalStore;
    await user.type(input, "123456789");
    expect(input.value).toBe("(123) 456-789");
  });

  it("Typing '1234567890' formats to '(123) 456-7890'", async () => {
    const { user, input } = globalStore;
    await user.type(input, "1234567890");
    expect(input.value).toBe("(123) 456-7890");
  });
  
  it("Typing '1234567890' one digit at a time ultimately formats to '(123) 456-7890'", async () => {
    const { user, input } = globalStore;
    await user.type(input, "1");
    expect(input.value).toBe("1");
    await user.type(input, "2");
    expect(input.value).toBe("12");
    await user.type(input, "3");
    expect(input.value).toBe("123");
    await user.type(input, "4");
    expect(input.value).toBe("(123) 4");
    await user.type(input, "5");
    expect(input.value).toBe("(123) 45");
    await user.type(input, "6");
    expect(input.value).toBe("(123) 456");
    await user.type(input, "7");
    expect(input.value).toBe("(123) 456-7");
    await user.type(input, "8");
    expect(input.value).toBe("(123) 456-78");
    await user.type(input, "9");
    expect(input.value).toBe("(123) 456-789");
    await user.type(input, "0");
    expect(input.value).toBe("(123) 456-7890");
  });
});

describe('Caret does not reset to end of number when deleting middle digits', () => {
  
  beforeEach(async () => {
    await setupReact();
    const {user, input} = globalStore;
    await user.type(input, "1234567890")
  });
    
  it("Backspace deleting middle digits does not reset caret to end", async () => {
    const { user, input } = globalStore;
    input.setSelectionRange(13,13)
    await user.keyboard('{Backspace}')
    expect(input.value).toBe("(123) 456-780");
    expect(input.selectionStart).toBe(12);
    expect(input.selectionEnd).toBe(12);
    expect(input.selectionStart).not.toBe(input.value.length)
    await user.keyboard('{Backspace}')
    expect(input.value).toBe("(123) 456-70");
    expect(input.selectionStart).toBe(11);
    expect(input.selectionEnd).toBe(11);
    expect(input.selectionStart).not.toBe(input.value.length)
    await user.keyboard('{Backspace}')
    expect(input.value).toBe("(123) 456-0");
    expect(input.selectionStart).toBe(9);
    expect(input.selectionEnd).toBe(9);
    expect(input.selectionStart).not.toBe(input.value.length)
    await user.keyboard('{Backspace}')
    expect(input.value).toBe("(123) 450");
    expect(input.selectionStart).toBe(8);
    expect(input.selectionEnd).toBe(8);
    expect(input.selectionStart).not.toBe(input.value.length)
    await user.keyboard('{Backspace}')
    expect(input.value).toBe("(123) 40");
    expect(input.selectionStart).toBe(7);
    expect(input.selectionEnd).toBe(7);
    expect(input.selectionStart).not.toBe(input.value.length)
    await user.keyboard('{Backspace}')
    expect(input.value).toBe("(123) 0");
    expect(input.selectionStart).toBe(4);
    expect(input.selectionEnd).toBe(4);
    expect(input.selectionStart).not.toBe(input.value.length)
    await user.keyboard('{Backspace}')
    expect(input.value).toBe("120");
    expect(input.selectionStart).toBe(2);
    expect(input.selectionEnd).toBe(2);
    expect(input.selectionStart).not.toBe(input.value.length)
    await user.keyboard('{Backspace}')
    expect(input.value).toBe("10");
    expect(input.selectionStart).toBe(1);
    expect(input.selectionEnd).toBe(1);
    expect(input.selectionStart).not.toBe(input.value.length)
    await user.keyboard('{Backspace}')
    expect(input.value).toBe("0");
    expect(input.selectionStart).toBe(0);
    expect(input.selectionEnd).toBe(0);
    expect(input.selectionStart).not.toBe(input.value.length)
  });
  
  it("Forward deleting middle digits does not reset caret to end", async () => {
    const { user, input } = globalStore;
    input.setSelectionRange(2,2)
    await user.keyboard('{Delete}')
    expect(input.value).toBe("(134) 567-890");
    expect(input.selectionStart).toBe(2);
    expect(input.selectionEnd).toBe(2);
    expect(input.selectionStart).not.toBe(input.value.length)
    await user.keyboard('{Delete}')
    expect(input.value).toBe("(145) 678-90");
    expect(input.selectionStart).toBe(2);
    expect(input.selectionEnd).toBe(2);
    expect(input.selectionStart).not.toBe(input.value.length)
    await user.keyboard('{Delete}')
    expect(input.value).toBe("(156) 789-0");
    expect(input.selectionStart).toBe(2);
    expect(input.selectionEnd).toBe(2);
    expect(input.selectionStart).not.toBe(input.value.length)
    await user.keyboard('{Delete}')
    expect(input.value).toBe("(167) 890");
    expect(input.selectionStart).toBe(2);
    expect(input.selectionEnd).toBe(2);
    expect(input.selectionStart).not.toBe(input.value.length)
    await user.keyboard('{Delete}')
    expect(input.value).toBe("(178) 90");
    expect(input.selectionStart).toBe(2);
    expect(input.selectionEnd).toBe(2);
    expect(input.selectionStart).not.toBe(input.value.length)
    await user.keyboard('{Delete}')
    expect(input.value).toBe("(189) 0");
    expect(input.selectionStart).toBe(2);
    expect(input.selectionEnd).toBe(2);
    expect(input.selectionStart).not.toBe(input.value.length)
    await user.keyboard('{Delete}')
    expect(input.value).toBe("190");
    expect(input.selectionStart).toBe(1);
    expect(input.selectionEnd).toBe(1);
    expect(input.selectionStart).not.toBe(input.value.length)
    await user.keyboard('{Delete}')
    expect(input.value).toBe("10");
    expect(input.selectionStart).toBe(1);
    expect(input.selectionEnd).toBe(1);
    expect(input.selectionStart).not.toBe(input.value.length)
  });
  
})

async function setupReact() {
  const user = userEvent.setup();
  render(<PhoneInput />);
  globalStore.user = user;
  globalStore.input = screen.getByLabelText("(123) 456-7890");
}
