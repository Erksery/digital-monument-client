import { useCloudPayments } from "@/components/providers/PaymentsProvider";
import styles from "./index.module.scss";
import { refreshFetch } from "@/api/refreshFetch";

interface PaymentButtonProps {
  allChecked: boolean;
}

export const PaymentButton = ({ allChecked }: PaymentButtonProps) => {
  const { open, ready } = useCloudPayments();

  const handlePayTest = async () => {
    try {
      const response = await refreshFetch(
        "/api/payments/cloudpayments/test/premium",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      if (!response.ok) {
        throw new Error("Не удалось получить премиум-валюту");
      }

      const data = await response.json();

      console.log("Тестовая премиум-валюта выдана:", data);

      alert(
        `Премиум активирован!\n\n` +
          `Покупка: ${data.purchaseId}\n` +
          `Сумма: ${data.amount} ${data.currency}`,
      );
    } catch (error) {
      console.error("Ошибка получения премиум-валюты:", error);

      alert("Не удалось активировать премиум. Попробуйте еще раз.");
    }
  };

  const handlePay = () => {
    open(
      {
        publicId: "test_api_00000000000000000000002",
        description: "Оплата заказа №105",
        amount: 1500,
        currency: "RUB",
        invoiceId: "105",
        accountId: "user_42",
        email: "client@example.com",
        skin: "modern",
      },
      {
        onSuccess: (options) => {
          console.log("Успешный платеж!", options);
          alert("Спасибо за оплату!");
        },
        onFail: (reason, options) => {
          console.error("Ошибка платежа:", reason, options);
          alert("Оплата не прошла. Попробуйте еще раз.");
        },
        onComplete: (paymentResult, options) => {
          console.log("Виджет закрыт, итоговый статус:", paymentResult);
        },
      },
    );
  };

  return (
    <button
      className={`${styles.activate_button} ${
        allChecked ? styles.activate_button_enabled : ""
      }`}
      disabled={!allChecked}
      onClick={() => {
        if (allChecked) {
          handlePay();
          handlePayTest();
        }
      }}
    >
      Активировать тариф
    </button>
  );
};
