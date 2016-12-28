
class BaseModel(object):

    def info_log(self, msg):
        formatted_msg = '[{model_name}] {msg}'\
            .format(model_name=self.name, msg=msg)
        self.pdriver.info_log(formatted_msg)

    def debug_info(self, msg):
        formatted_msg = '[{model_name}] {msg}'\
            .format(model_name=self.name, msg=msg)
        self.pdriver.info_log(formatted_msg)
