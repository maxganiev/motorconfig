<?php
class ControllerToolAdchrTestAdchr extends Controller
{
	public function index()
	{
		$this->document->addStyle('catalog/view/theme/default/stylesheet/tool/adchr/style.css');

		$data['footer'] = $this->load->controller('common/footer');
		$data['header'] = $this->load->controller('common/header');

		$this->response->setOutput($this->load->view('tool/adchr/test/adchr', $data));
	}

	//get data by model input and frameSize:
	public function get_data_by_input()
	{
		$this->load->model('tool/adchr/test/adchr');
		$json = $this->model_tool_adchr_test_adchr->get_data_by_input($this->request->post['keyword'], $this->request->post['type']);


		$this->response->addHeader('Content-Type: application/json');
		$this->response->setOutput(json_encode($json));
	}

	//get data by power and rpm selection:
	public function get_data_by_power_and_rpm_selection()
	{
		$this->load->model('tool/adchr/test/adchr');

		$json = $this->model_tool_adchr_test_adchr->get_data_by_power_and_rpm_selection($this->request->post['power'], $this->request->post['rpm'], $this->request->post['type']);

		$this->response->addHeader('Content-Type: application/json');
		$this->response->setOutput(json_encode($json));
	}

	//get attrs by switching motor config:
	public function get_attrs()
	{
		$this->load->model('tool/adchr/test/adchr');

		$json = $this->model_tool_adchr_test_adchr->get_attrs($this->request->post['keyword'], $this->request->post['type'], $this->request->post['model'], $this->request->post['pawtype'], $this->request->post['with_brakes'], $this->request->post['with_encoder'], $this->request->post['with_vent'], $this->request->post['power'], $this->request->post['rpm']);

		$this->response->addHeader('Content-Type: application/json');
		$this->response->setOutput(json_encode($json));
	}
}
