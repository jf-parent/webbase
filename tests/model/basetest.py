#! -*- coding: utf-8 -*-

from brome.core.basetest import BaseTest as BromeBaseTest

from model.app import App


class BaseTest(BromeBaseTest):

    def before_run(self):
        self.app = App(self.pdriver)
