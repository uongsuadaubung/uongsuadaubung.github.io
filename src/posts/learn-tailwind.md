---
title: "Tailwind Component"
date: "2024-09-06"
tags: ["Chuyện Nghề"]
description: "Sau một thời gian ngắn tìm hiểu về Tailwind mình thấy cũng khá là hay, do là trước giờ mình từng làm về Vuejs hay React thì công ty đều sử..."
published: true
---

![minh-hoa](/images/learn-tailwind/image-01.png)

Sau một thời gian ngắn tìm hiểu về Tailwind mình thấy cũng khá là hay, do là trước giờ mình từng làm về Vuejs hay React thì công ty đều sử dụng Vue Bootstrap hay là React Bootstrap nên mình quá quen với sự tiện lợi sẵn có của nó rồi nên khi quay ra Tailwind này không có sẵn các component, bảo là không có sẵn thì không đúng, ta hoàn toàn có thể kéo thêm UI component về nhưng mà nó lại bị phụ thuộc vào style của bên cung cấp đó, thôi cho nên mình sẽ tự tạo các component của mình ở mức đủ dùng thôi ví dụ như Table, Navigation bar, Modal, vài cái cơ bản mà hiện tại mình nghĩ đến, rồi sau này thiếu đâu làm thêm đó.

## Modal

Hiện tại công ty mình đang sử dụng React Bootstrap nó cung cấp sẵn Modal nhưng có 1 vấn đề mình cực kỳ khó chịu khi sử dụng 

```javascript
function Example() {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <Button variant="primary" onClick={handleShow}>
        Launch demo modal
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Modal heading</Modal.Title>
        </Modal.Header>
        <Modal.Body>Woohoo, you are reading this text in a modal!</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleClose}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
```

Đó chính là thuộc tính **show** và **onHide** ừ thì chấp nhận 1 2 cái modal thì không sao nhưng mà làm ứng dụng web nên modal nó nhiều vô kể, từ những cái confirm, rồi đến cả những cái form phụ phụ nên làm nhiều modal rất cáu, lặp đi lặp lại việc xử ý **show** rồi **handleClose**.

Tại đây mình sẽ làm 1 Modal khắc phục được cái vấn đề mình không thích, ý tưởng thì là gọi hàm showModal sau đó sẽ truyền Modal cần hiển thị lên, có thể là truyền thêm props để điều chỉnh size, title cho modal, có thể là callback nếu cần thiết :D

Nghiên cứu 1 lúc thì thấy khả thi vì trong React có thể sử dụng Context để quản lý các modal, ta sẽ tạo 1 Provider như sau,

```javascript
<ModalContext.Provider value={{ showModal, hideModal }}>
  {children}
  {modals.map(({ Component, props, id }) => (
    <Component key={id} {...props} />
  ))}
</ModalContext.Provider>
```

Phần xử lý showModal và hideModal cũng đơn giản thôi

```javascript
const [modals, setModals] = useState<ModalState[]>([]);

const showModal = (Component: FC<ModalProps>, props: ModalPropsWithoutId, externalId?: string): string => {
  const id = externalId || Math.random().toString(36).slice(2, 9);
  setModals([...modals, { Component, props: { ...props, id }, id }]);
  return id;
};

const hideModal = (id: string) => {
  setModals(modals.filter((modal) => modal.id !== id));
};
```

cụ thể là khi showModal, ta truyền 1 Modal vào thì nó sẽ được push vào mảng modals, sau đó trên giao diện sẽ được hiển thị ra, khi hideModal thì loại bỏ modal khoải mảng thì nó sẽ biến mất thôi

Mình xây dựng Modal như sau

```javascript
const Modal: FC<ModalProps> = ({ id, onClose, title, children, size="md" }) => {
  const {hideModal} = useModal()
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose?.();
        hideModal(id);
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [hideModal, id, onClose]);

  return (
    <div
      id={id}
      tabIndex={-1}
      aria-hidden="true"
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden bg-black bg-opacity-50"
    >
      <div className={`relative p-4 w-full ${sizeClasses[size]} max-h-full`}>
        <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
          {/* Modal header */}
          <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              {title}
            </h3>
            <button
              type="button"
              className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
              onClick={() => hideModal(id)}
            >
              <svg
                className="w-3 h-3"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 14 14"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M1 1l6 6m0 0l6 6M7 7l6-6M7 7L1 13"
                />
              </svg>
              <span className="sr-only">Close modal</span>
            </button>
          </div>
          {/* Modal body */}
          <div className="p-4 md:p-5 space-y-4">{children}</div>
          {/* Modal footer */}
          {/*Chưa có ý định làm gì với nó*/}
        </div>
      </div>
    </div>
  );
};
```

Về cơ bản thì nó là một bộ khung bên ngoài chỉ có title và một nút close trên góc phải, mọi thứ bên trong sẽ là phần children, đương nhiên mình sẽ không điền luôn children vào đây vì làm thế này để có thể tái sử dụng được Modal này

Sau đó khi muốn tạo thêm nhiều Modal với nhiều mục đích khác nhau chỉ cần gọi đến khung Modal này và truyền children vào

```javascript
const ModalHihi:FC<ModalProps> = (props)=>{
  return <Modal {...props}>
    hahah
  </Modal>
}
export default ModalHihi;
```

Để hiển thị ModalHihi mẫu của mình thì làm như sau

```javascript
const ExampleComponent: React.FC = () => {
  const { showModal} = useModal();

  const openModal = () => {
    showModal(ModalHihi, {
      title :"Hello World",
      size: "2xl"

    });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <button
        className="px-4 py-2 bg-blue-500 text-white rounded"
        onClick={openModal}
      >
        Show Modal
      </button>
    </div>
  );
};
```

ở đây mình chỉ tạo 1 button, gọi đến hàm showModal và truyền vào Modal hihi, mình cũng có thể custom size và title.

![minh-hoa](/images/learn-tailwind/image-02.png)

kết quả hoạt động đúng với mong đợi

## Toast

Cũng giống với Modal thì mình sẽ tạo thêm 1 mảng để chứa toast, nhưng trước tiên mình sẽ triển khai cái Alert trước vì nó trông cũng khá ổn, nhìn giống thông báo.

Loay hoay tìm code về Alert thì mình cũng đóng nó thành 1 cái component như sau:

```javascript
export default function Alert(props: AlertProps) {
  const {variant = "primary"} = props
  const [visible, setVisible] = useState(false);

  const handleClose = useCallback(() => {
    setVisible(false);
    setTimeout(() => props.onClose?.(), 500);
  },[props])

  useEffect(() => {
    setVisible(true);
    if (props.isNotification){
      setTimeout(() =>
        handleClose()
      , 7000);

    }

  }, [handleClose, props.isNotification]);

  return <div
    className={`rounded flex items-center p-4 mb-4 border dark:bg-gray-800 transition-all duration-500 ease-in-out ${
      visible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-3'} ` + AlertVariant[variant]}
    role="alert">
    <svg className="flex-shrink-0 w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor"
      viewBox="0 0 20 20">
      <path
        d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z"/>
    </svg>
    <div>
      <div className="ms-3 font-medium">
        {props.title}
      </div>
      <div className="ms-3 text-sm font-base">
        {props.text}
      </div>
    </div>
    {
      props.showButton? (
        <button onClick={handleClose} type="button"
          className={"ms-auto -mx-1.5 -my-1.5 rounded-lg p-1.5 inline-flex items-center justify-center h-8 w-8 dark:bg-gray-800 dark:hover:bg-gray-700" + AlertButtonColor[variant] }
          data-dismiss-target="#alert-border-1" aria-label="Close">
          <span className="sr-only">Dismiss</span>
          <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
              d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
          </svg>
        </button>
      ) : null
    }

  </div>
}
```

Về cơ bản chúng nó trông như sau

![minh-hoa](/images/learn-tailwind/image-03.png)

Trong trường hợp là 1 Alert bình thường thì nó vẫn cứ ở đó, nhưng nếu nó được coi là 1 toast thì sẽ xuất hiện bên góc phải màn hình và luôn có nút ấn tắt, mặc định 7 giây tự ẩn

![minh-hoa](/images/learn-tailwind/image-04.png)

Triển khai cũng gần giống với Modal, mình tận dụng luôn Context làm Modal để quản lý Toast ở đây luôn

```javascript
const [alerts, setAlerts] = useState<AlertState[]>([]);

const showAlert = (variant: AlertProps['variant'], props: ToastProps) => {
  const id = Math.random().toString(36).slice(2, 9);
  setAlerts(prevState => [...prevState, { id, variant, props }]);
};
const hideAlert = (id: string) => {
  setAlerts(prevState => prevState.filter((alert) => alert.id !== id));
};
const toast = {
  info: (text: string, props?: ToastProps) => showAlert('info', {...props, text}),
  success: ( text: string, props?: ToastProps) => showAlert('success', {...props, text}),
  warning: ( text: string, props?: ToastProps) => showAlert('warning', {...props, text}),
  danger: (text: string, props?: ToastProps) => showAlert('danger', {...props, text}),
  primary: (text: string, props?: ToastProps) => showAlert('primary', {...props, text}),
};

return (
  <UIContext.Provider value={{showModal, hideModal, toast}}>
    {children}
    {modals.map(({Component, props, id}) => (
      <Component key={id} {...props} />
    ))}
    <div className="fixed top-4 right-4 z-50 flex flex-col space-y-2 max-w-md w-full">
      {alerts.map(({id, variant, props: {title, text}}) => (
        <Alert
          key={id}
          variant={variant}
          title={title}
          text={text}
          onClose={() => hideAlert(id)}
          isNotification={true}
          showButton={true}
        />
      ))}
    </div>
  </UIContext.Provider>
);
};
```
