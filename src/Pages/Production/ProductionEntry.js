import {
  Button,
  Form,
  InputNumber,
  Row,
  Select,
  Switch,
  Col,
  message,
} from "antd";
import {
  GetItemLists,
  InsertUpdateDayWiseProductionDetail,
} from "../../Services/appServices/ProductionService";
import Header from "../../Components/Common/Header";
import TextArea from "antd/lib/input/TextArea";
import { useState } from "react";
import ProductionEntryTab from "./productionEntryTab";
import styled from "styled-components";
import { useEffect } from "react";
import useToken from "../../Helpers/useToken";
const { Option } = Select;
const layout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 20,
  },
};

const ProductionEntry = () => {
  const [form] = Form.useForm();
  const date = new Date().toISOString();
  const [isbutdis, setisbutdis] = useState(false);
  const [reloadTable, setreloadTable] = useState(false);
  const [ItemLists, setItemLists] = useState();

  const { token } = useToken();
  // console.log("aaa", token);

  const onFinish = (values) => {
    setisbutdis(true);

    let data = {
      PId: 0,
      ItemId: values.ProductionName,

      Quantity: values.Quantity,
      Remarks: values.remarks !== undefined ? values.remarks : "n/a",
      UserId: token.id,
      EntryDate: date,
      IsActive:
        values.isActive === undefined || values.isActive === true
          ? true
          : false,
      SpoilageCount: values.SpoilageCount,
    };

    InsertUpdateDayWiseProductionDetail(data, (res) => {
      if (res?.SuccessMsg === true) {
        message.success("The data is saved");
        setisbutdis(false);
        setreloadTable(true);
        onReset();
      } else {
        message.error("Error!");
        setisbutdis(false);
        setreloadTable(false);
      }
    });
  };

  const onReset = () => {
    form.resetFields();
  };

  const tableAfterReloaded = (e) => {
    setreloadTable(false);
  };

  useEffect(() => {
    GetItemLists((res) => {
      // console.log("item list", res.ItemList);
      setItemLists(res.ItemList);
    });
  }, []);

  return (
    <>
      <Header title={"Production Entry"}></Header>
      <div className="mainContainer">
        <Row>
          <Col span={7}>
            <div>
              <Form
                {...layout}
                form={form}
                name="control-hooks"
                onFinish={onFinish}
                style={{ marginTop: "20px" }}
                id="productionEntry"
              >
                <h2
                  style={{
                    fontSize: "1.5rem",
                    marginBottom: "30px",
                  }}
                >
                  Add Production:
                </h2>
                <Form.Item
                  name="ProductionName"
                  label="Name"
                  id="productionName"
                  rules={[
                    {
                      required: true,
                    },
                  ]}
                >
                  <Select
                    showSearch
                    filterOption={(input, option) => {
                      return (
                        option.key.toLowerCase().indexOf(input.toLowerCase()) >=
                          0 ||
                        option.title
                          .toLowerCase()
                          .indexOf(input.toLowerCase()) >= 0
                      );
                    }}
                  >
                    {/* {dummydata.map((e) => (
                      <Option title={e.name} value={e.id} key={e.id}>
                        {e.name}
                      </Option>
                    ))} */}
                    {ItemLists !== undefined &&
                      ItemLists.map((e) => (
                        <Option title={e.ItmName} value={e.itmId} key={e.itmId}>
                          {e.ItmName}
                        </Option>
                      ))}
                  </Select>
                </Form.Item>
                <Form.Item
                  name="Quantity"
                  label="Good for Sale"
                  id="Quantity"
                  rules={[
                    {
                      required: true,
                    },
                  ]}
                >
                  <InputNumber min={1} style={{ width: "100%" }} />
                </Form.Item>
                <Form.Item
                  name="SpoilageCount"
                  label="Spoilage"
                  id="SpoilageCount"
                  rules={[
                    {
                      required: true,
                    },
                  ]}
                >
                  <InputNumber min={1} style={{ width: "100%" }} />
                </Form.Item>

                <Form.Item name="remarks" label="remarks" id="remark">
                  <TextArea rows={5} />
                </Form.Item>
                <Form.Item
                  name="isActive"
                  label="isActive"
                  valuePropName="Checked"
                >
                  <Switch defaultChecked />
                </Form.Item>

                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    style={{
                      marginLeft: "100px",
                      padding: "2px 30px",
                      fontSize: "15px",
                    }}
                    id="saveBtn"
                    disabled={isbutdis}
                    loading={isbutdis}
                  >
                    Add Production
                  </Button>
                </Form.Item>
              </Form>
            </div>
          </Col>
          <Col span={15} offset={2}>
            <div
              style={{
                borderLeft: "2px solid #888282",
                paddingLeft: "20px",
              }}
            >
              <ProductionEntryTab
                reloadTable={reloadTable}
                tableAfterReloaded={tableAfterReloaded}
              />
            </div>
          </Col>
        </Row>
      </div>
    </>
  );
};

export default ProductionEntry;

const ProductionStyle = styled.div`
  /* position: absolute; */
  background-color: #fefefe;
  padding: 10px;
  border-radius: 8px;
  overflow: hidden;
  height: 500px;
  margin-bottom: 8px;
  box-shadow: -1px 1px 6px 2px rgba(186, 186, 186, 0.75);
  -webkit-box-shadow: -1px 1px 6px 2px rgba(186, 186, 186, 0.75);
  -moz-box-shadow: -1px 1px 6px 2px rgba(186, 186, 186, 0.75);
`;
